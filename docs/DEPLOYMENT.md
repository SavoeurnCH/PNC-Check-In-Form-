# Deploying to a server with nginx

Single-VM setup: nginx serves the built frontend and reverse-proxies `/api`
and `/health` to the Node API running under systemd, with MySQL on the same
box. Assumes a fresh **Ubuntu 22.04/24.04** server reachable by SSH and a
domain name already pointed at its IP. Adjust package manager commands
(`apt` → `dnf`/`yum`) for other distros.

Templates referenced below live in [../deploy/](../deploy/):
[nginx.conf](../deploy/nginx.conf), [pnc-visitor-api.service](../deploy/pnc-visitor-api.service).

---

## 0. Before you start

- [ ] Domain's DNS A record already points at the server's IP (TLS in step 6
      needs this to have propagated).
- [ ] You can SSH in with a non-root sudo user (don't deploy as root).

---

## 1. Install prerequisites

```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL, nginx, certbot, git
sudo apt install -y mysql-server nginx certbot python3-certbot-nginx git

node -v   # confirm v20.x
```

---

## 2. Get the code onto the server

```bash
sudo mkdir -p /var/www/pnc-visitor-app
sudo chown $USER:$USER /var/www/pnc-visitor-app
git clone <your-repo-url> /var/www/pnc-visitor-app
cd /var/www/pnc-visitor-app
```

(No repo yet? `scp -r` the project folder instead — same target path.)

---

## 3. Database — dedicated user, not root

Local dev used `root`/no-password (see [../server/README.md](../server/README.md)).
**Do not do that here.** Create a least-privilege user scoped to one database:

```bash
sudo mysql
```

```sql
CREATE DATABASE pnc_visitor_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pnc_app'@'localhost' IDENTIFIED BY 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON pnc_visitor_app.* TO 'pnc_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Generate the password (and the JWT secret in the next step) with:

```bash
openssl rand -base64 32
```

---

## 4. Backend

```bash
cd /var/www/pnc-visitor-app/server
npm ci --omit=dev
cp .env.example .env
```

Edit `.env`:

```env
PORT=8000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_USER=pnc_app
DB_PASSWORD=<the password you generated above>
DB_NAME=pnc_visitor_app

JWT_SECRET=<a different openssl rand -base64 32 value>
JWT_EXPIRES_IN=8h

# nginx serves both frontend and API from the same origin (see step 6), so
# this is a defensive fallback rather than something the browser will
# actually hit cross-origin.
CORS_ORIGIN=https://YOUR_DOMAIN
```

```bash
npm run migrate
npm run seed   # creates admin@pnc-pss.local — see step 4a
```

### 4a. Replace the seeded admin password immediately

`npm run seed` creates `admin@pnc-pss.local` / `ChangeMe123!` — fine for
local dev, not for production. Set a real one:

```bash
node -e "
import('bcryptjs').then(async ({ default: bcrypt }) => {
  const hash = await bcrypt.hash('YOUR-REAL-PASSWORD', 10)
  console.log(hash)
})
"
```

```bash
sudo mysql pnc_visitor_app -e \
  "UPDATE users SET password_hash='<hash from above>' WHERE email='admin@pnc-pss.local';"
```

### 4b. Run it as a service (not by hand)

```bash
sudo useradd --system --no-create-home --group pncapp
sudo chown -R pncapp:pncapp /var/www/pnc-visitor-app/server

sudo cp /var/www/pnc-visitor-app/deploy/pnc-visitor-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now pnc-visitor-api
sudo systemctl status pnc-visitor-api   # should show "active (running)"
```

Logs: `sudo journalctl -u pnc-visitor-api -f`

---

## 5. Frontend

```bash
cd /var/www/pnc-visitor-app
```

Edit `.env.production`:

```env
VITE_API_BASE_URL=https://YOUR_DOMAIN/api
VITE_USE_MOCK_API=false
```

```bash
npm ci
npm run build
```

This produces `/var/www/pnc-visitor-app/dist` — exactly the path
`deploy/nginx.conf`'s `root` points at.

---

## 6. nginx + TLS

```bash
sudo cp /var/www/pnc-visitor-app/deploy/nginx.conf /etc/nginx/sites-available/pnc-visitor-app
sudo sed -i 's/YOUR_DOMAIN/your-actual-domain.com/' /etc/nginx/sites-available/pnc-visitor-app
sudo ln -s /etc/nginx/sites-available/pnc-visitor-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove the stock placeholder site

sudo nginx -t && sudo systemctl reload nginx

# Provisions the cert, rewrites the site config to add the :443 block and
# the http->https redirect automatically.
sudo certbot --nginx -d your-actual-domain.com
```

---

## 7. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # 80 + 443
sudo ufw enable
```

Port 8000 (the Node process) is never opened externally — nginx reaches it
over `127.0.0.1` only, per `deploy/nginx.conf`.

---

## 8. Verify

```bash
curl https://your-actual-domain.com/health
# {"status":"ok","db":"connected"}
```

Then open the domain in a browser and run the actual check-in flow —
confirm it reaches step 5, submits, shows the badge code, and that the row
lands in MySQL (`mysql pnc_visitor_app -e "SELECT full_name, badge_code FROM visitors ORDER BY checked_in_at DESC LIMIT 1;"`).

---

## 9. Redeploying after changes

```bash
cd /var/www/pnc-visitor-app
git pull

# Backend
cd server && npm ci --omit=dev && npm run migrate
sudo systemctl restart pnc-visitor-api

# Frontend
cd .. && npm ci && npm run build
# nginx serves dist/ directly — no reload needed unless nginx.conf itself changed
```

---

## Still open before this is fully production-ready

These aren't nginx/deploy-specific — see
[../server/README.md](../server/README.md)'s "Not yet done" section and
[BACKEND_API_TODO.md](BACKEND_API_TODO.md) §5:

- [ ] **Data retention / PII access policy** for visitor data and
      safeguarding acknowledgments — an organizational decision, not a
      technical one, but it should be settled before real visitor data
      accumulates.
- [ ] **Database backups** — nothing here sets those up
      (`mysqldump` cron job, or your host's managed-DB backup feature if
      you move off a self-hosted MySQL later).
- [ ] **Error tracking / uptime monitoring** — logs currently only go to
      `journalctl`; consider Sentry (or similar) and an uptime check
      against `/health`.
- [ ] **Kiosk device behavior** — idle-timeout reset to step 1, fullscreen
      kiosk-mode browser lockdown on the physical device, and what the
      visitor sees on a network drop mid-submit aren't addressed by this
      guide (it's app-hosting, not device-provisioning).
