import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Set here (not via shell `NODE_ENV=test`) so `npm test` works the same
    // on bash/PowerShell/cmd without a cross-env dependency.
    env: { NODE_ENV: 'test' },
    // Test files share one physical MySQL test database and truncate it in
    // beforeEach — running files in parallel would race those truncations.
    fileParallelism: false,
    testTimeout: 15000,
  },
})
