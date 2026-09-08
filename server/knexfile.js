import 'dotenv/config'

/** @type {Record<string, import('knex').Knex.Config>} */
const base = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pnc_visitor_app',
  },
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
}

export default {
  development: base,
  test: {
    ...base,
    connection: { ...base.connection, database: `${base.connection.database}_test` },
  },
  production: base,
}
