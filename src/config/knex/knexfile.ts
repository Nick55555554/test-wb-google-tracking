import env from '../env';

const connection = {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
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
