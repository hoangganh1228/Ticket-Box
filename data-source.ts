import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { buildTypeOrmOptions } from './src/database/typeorm.options';

dotenv.config();
export const AppDataSource = new DataSource(buildTypeOrmOptions());
