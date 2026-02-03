import { AppDataSource } from './data-source.js';
import app from './app.js';
import { PORT } from './config.js';

async function main() {
  await AppDataSource.initialize();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
