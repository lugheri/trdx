import dotenv from 'dotenv';
import {resolve} from 'path';

const dotenvFilePath = resolve(__dirname,'..','..','.env');
dotenv.config({path: dotenvFilePath});

module.exports = {
    client: 'mysql2',
    connection: {
      database: process.env.DATABASE,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname,'migrations'),
    }
  };
