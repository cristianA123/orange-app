import { AppDataSource } from '../data-source';
import { seedInstitutes } from './institutes.seed';
import { seedUsers } from './users.seed';
import { seedModules } from './modules.seed';

async function main() {
  console.log('→ Conectando a DB...');
  await AppDataSource.initialize();

  const runner = AppDataSource.createQueryRunner();
  await runner.connect();

  try {
    console.log('→ Seeding institutes');
    await seedInstitutes(runner);

    console.log('→ Seeding users');
    await seedUsers(runner);

    console.log('→ Seeding modules + assignments');
    await seedModules(runner);

    console.log('✓ Seed completado');
  } catch (err) {
    console.error('✗ Seed falló:', err);
    process.exitCode = 1;
  } finally {
    await runner.release();
    await AppDataSource.destroy();
  }
}

main();
