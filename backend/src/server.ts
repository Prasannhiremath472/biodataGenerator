import { createApp } from './app';
import { env } from './config/env';
import { checkDbConnection } from './config/db';

async function main(): Promise<void> {
  await checkDbConnection();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Biodata Generator API listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
