import { Knex } from 'knex';

import { Tariff as TariffType, WarehouseTariff } from '@/types';

import { Tariff } from '../../db/models/tariff';

export class TariffRepository {
    static async upsert(data: WarehouseTariff[], trx: Knex): Promise<void> {
        const dataWithDate = data.map(item => ({
            ...item,
            date: new Date().toISOString().split('T')[0],
        }));

        await Tariff.upsert(dataWithDate, trx);
        return;
    }

    static async getAll(db: Knex): Promise<TariffType[]> {
        return Tariff.getAll(db);
    }

    static async getById(id: string, db: Knex): Promise<TariffType | null> {
        return Tariff.getById(id, db);
    }
}
