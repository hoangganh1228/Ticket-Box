import { DataSource } from 'typeorm';
import { seedRoles } from './seeds/roles.seed';
import { AppDataSource } from '../../data-source';

const runSeed = async () => {
  try {
    const dataSource: DataSource = await AppDataSource.initialize();

    console.log('🚀 Start seeding database...');
    await seedRoles(dataSource);

    console.log('🎉 Seeding completed!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

runSeed();
