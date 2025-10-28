import type { Knex } from 'knex';

module.exports = {
    async up(knex: Knex): Promise<void> {
        return knex.raw(`
            CREATE TABLE IF NOT EXISTS tariffs(
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                date DATE NOT NULL,
                warehouse_name TEXT NOT NULL,
                geo_name TEXT NOT NULL,
                
                box_delivery_base TEXT NOT NULL,
                box_delivery_coef_expr TEXT NOT NULL,
                box_delivery_liter TEXT NOT NULL,
                
                box_delivery_marketplace_base TEXT NOT NULL,
                box_delivery_marketplace_coef_expr TEXT NOT NULL,
                box_delivery_marketplace_liter TEXT NOT NULL,
                
                box_storage_base TEXT NOT NULL,
                box_storage_coef_expr TEXT NOT NULL,
                box_storage_liter TEXT NOT NULL,
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                CONSTRAINT unique_tariff_entry UNIQUE (date, warehouse_name, geo_name)
            );
        `);
    },

    async down(knex: Knex): Promise<void> {
        return knex.raw(`DROP TABLE IF EXISTS tariffs`);
    },
};
