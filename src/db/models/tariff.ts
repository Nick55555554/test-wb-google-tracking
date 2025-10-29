import camelcaseKeys from 'camelcase-keys';
import { Knex } from 'knex';
import snakecaseKeys from 'snakecase-keys';

import { Tariff as TariffType, WarehouseTariff } from '@/types';

export type CreateTariffData = WarehouseTariff & {
    date: string; // Дата YYYY-MM-DD
};

export class Tariff implements TariffType {
    static readonly tableName = 'tariffs';
    static readonly idColumn = 'id';

    static query(knex: Knex, trx?: Knex) {
        return (trx || knex)(this.tableName);
    }

    // Новый метод для вставки новых данных
    static async insert(data: CreateTariffData[], trx: Knex): Promise<TariffType[]> {
        const snakeCaseData = data.map(item => snakecaseKeys(item, { deep: true }));

        const result = await this.query(trx).insert(snakeCaseData).returning('*');

        return camelcaseKeys(result, { deep: true });
    }

    static async update(data: CreateTariffData[], trx: Knex): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        for (const item of data) {
            const snakeCaseItem = snakecaseKeys(item, { deep: true });

            await this.query(trx)
                .where({
                    date: today,
                    warehouse_name: snakeCaseItem.warehouse_name,
                    geo_name: snakeCaseItem.geo_name,
                })
                .update(snakeCaseItem);
        }
    }

    static async getByDate(date: string, trx: Knex): Promise<TariffType[]> {
        const results = await this.query(trx).where({ date });
        return camelcaseKeys(results, { deep: true });
    }

    static async getToday(trx: Knex): Promise<TariffType[]> {
        const today = new Date().toISOString().split('T')[0];
        return this.getByDate(today, trx);
    }

    static async existsForDate(date: string, trx: Knex): Promise<boolean> {
        const result = await this.query(trx).where({ date }).limit(1).first();
        return !!result;
    }

    static async getAll(trx: Knex): Promise<TariffType[]> {
        const results = await this.query(trx);
        return camelcaseKeys(results, { deep: true });
    }

    id!: TariffType['id'];
    warehouseName!: TariffType['warehouseName'];
    geoName!: TariffType['geoName'];
    date!: TariffType['date'];

    boxDeliveryBase!: TariffType['boxDeliveryBase'];
    boxDeliveryCoefExpr!: TariffType['boxDeliveryCoefExpr'];
    boxDeliveryLiter!: TariffType['boxDeliveryLiter'];

    boxDeliveryMarketplaceBase!: TariffType['boxDeliveryMarketplaceBase'];
    boxDeliveryMarketplaceCoefExpr!: TariffType['boxDeliveryMarketplaceCoefExpr'];
    boxDeliveryMarketplaceLiter!: TariffType['boxDeliveryMarketplaceLiter'];

    boxStorageBase!: TariffType['boxStorageBase'];
    boxStorageCoefExpr!: TariffType['boxStorageCoefExpr'];
    boxStorageLiter!: TariffType['boxStorageLiter'];

    createdAt?: TariffType['createdAt'];
    updatedAt?: TariffType['updatedAt'];
}
