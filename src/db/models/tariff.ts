import camelcaseKeys from 'camelcase-keys';
import { Knex } from 'knex';
import snakecaseKeys from 'snakecase-keys';

import { Tariff as TariffType, WarehouseTariff } from '@/types';

export type CreateTariffData = WarehouseTariff & {
    date: string;
};
export class Tariff implements TariffType {
    static readonly tableName = 'tariffs';
    static readonly idColumn = 'id';

    static query(knex: Knex, trx?: Knex) {
        return (trx || knex)(this.tableName);
    }

    static async upsert(data: CreateTariffData[], trx: Knex): Promise<TariffType[]> {
        const snakeCaseData = data.map(item => snakecaseKeys(item, { deep: true }));

        const result = await this.query(trx)
            .insert(snakeCaseData)
            .onConflict(['date', 'warehouse_name', 'geo_name'])
            .merge()
            .returning('*');

        return camelcaseKeys(result, { deep: true });
    }

    static async getById(id: string, trx: Knex): Promise<TariffType | null> {
        const result = await this.query(trx).where({ id }).limit(1).first();
        return result ? camelcaseKeys(result, { deep: true }) : null;
    }

    static async getAll(trx: Knex): Promise<TariffType[]> {
        const results = await this.query(trx);
        return camelcaseKeys(results, { deep: true });
    }

    static async delete(id: string, trx: Knex) {
        return this.query(trx).delete().where({ id });
    }

    id!: TariffType['id'];
    warehouseName!: TariffType['warehouseName'];
    geoName!: TariffType['geoName'];

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
