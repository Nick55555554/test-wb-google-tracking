import dbConfig from '@/config/knex/knexfile'
import knex from 'knex'

const environment = process.env.NODE_ENV || 'development'
const config = dbConfig[environment as keyof typeof dbConfig]

export const db = knex(config)