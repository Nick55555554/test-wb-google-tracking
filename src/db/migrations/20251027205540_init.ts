import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.raw(`
        CREATE TABLE IF NOT EXISTS tariffs(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            date DATE NOT NULL,
            warehouse_name TEXT NOT NULL,
            geo_name TEXT NOT NULL,
            
            -- Box delivery fields (оригинальные названия из API)
            box_delivery_base TEXT NOT NULL,
            box_delivery_coef_expr TEXT NOT NULL,
            box_delivery_liter TEXT NOT NULL,
            
            -- Box delivery marketplace fields
            box_delivery_marketplace_base TEXT NOT NULL,
            box_delivery_marketplace_coef_expr TEXT NOT NULL,
            box_delivery_marketplace_liter TEXT NOT NULL,
            
            -- Box storage fields
            box_storage_base TEXT NOT NULL,
            box_storage_coef_expr TEXT NOT NULL,
            box_storage_liter TEXT NOT NULL,
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            UNIQUE INDEX idx_tariffs_unique (date, warehouse_name, geo_name)
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(`DROP TABLE IF EXISTS tariffs`);
}