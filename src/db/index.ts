import knex from 'knex';

import * as dbConfig from '@/config/knex/knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment as keyof typeof dbConfig];

export const db = knex(config);
