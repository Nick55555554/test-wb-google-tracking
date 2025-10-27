import { Tariff as TariffType } from "@/types";
import { Knex } from "knex";

export type CreateTariffData = Omit<TariffType, 'updatedAt' | "createdAt" | 'id'>

export class Tariff implements TariffType {
    static readonly tableName = 'tariffs';
    static readonly idColumn = 'id';

    static query(knex: Knex, trx?: Knex) {
        return (trx || knex)(this.tableName);
    }

    static async upsert(data: CreateTariffData, trx: Knex) {
        return this.query(trx)
            .insert(data)
            .onConflict(['date', 'warehouse_name', 'geo_name'])
            .merge()
            .returning('*');
    }


    static async get(id: string, trx: Knex) {
        return this.query(trx).where({ id }).limit(1).first();
    }


    static async delete(id: string, trx: Knex) {
        return this.query(trx).delete().where({ id });
    }



    id: TariffType['id'];
    warehouseName: TariffType['warehouseName'];
    geoName: TariffType['geoName'];
    
    boxDeliveryBase: TariffType['boxDeliveryBase'];
    boxDeliveryCoefExpr: TariffType['boxDeliveryCoefExpr'];
    boxDeliveryLiter: TariffType['boxDeliveryLiter'];
    
    boxDeliveryMarketplaceBase: TariffType['boxDeliveryMarketplaceBase'];
    boxDeliveryMarketplaceCoefExpr: TariffType['boxDeliveryMarketplaceCoefExpr'];
    boxDeliveryMarketplaceLiter: TariffType['boxDeliveryMarketplaceLiter'];
    
    boxStorageBase: TariffType['boxStorageBase'];
    boxStorageCoefExpr: TariffType['boxStorageCoefExpr'];
    boxStorageLiter: TariffType['boxStorageLiter'];
    
    createdAt?: TariffType['createdAt'];
    updatedAt?: TariffType['updatedAt'];
}