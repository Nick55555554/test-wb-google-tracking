import env from '../env';

const connection = {
    host: env.POSTGRES_HOST || 'localhost',
    port: env.POSTGRES_PORT || 5432,
    database: env.POSTGRES_DB || 'postgres',
    user: env.POSTGRES_USER || 'postgres',
    password: env.POSTGRES_PASSWORD || 'postgres',
};

module.exports = {
    development: {
        client: 'pg',
        connection,
        migrations: {
            directory: './src/db/migrations',
            tableName: 'knex_migrations',
            extension: 'ts',
        },
    },
    production: {
        client: 'pg',
        connection,
        migrations: {
            directory: '../../../dist/db/migrations',
            tableName: 'knex_migrations',
            extension: 'js',
            loadExtensions: ['.js'],
        },
    },
};
