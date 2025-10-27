import { Knex } from 'knex';

export class TariffRepository {
    static async upsert(data: any[], db: Knex): Promise<void> {
        return await db.transaction(async (trx) => {
            await trx('tariffs')
                .insert(data)
                .onConflict(['date', 'warehouse_name', 'geo_name'])
                .merge();
        });
    }
}