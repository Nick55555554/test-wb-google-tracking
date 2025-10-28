import { Knex } from 'knex';

declare module 'express-serve-static-core' {
    interface Request {
        db: Knex;
    }
}

export {};
