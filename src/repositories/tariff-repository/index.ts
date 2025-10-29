import { Knex } from 'knex';

import { Tariff as TariffType, WarehouseTariff } from '@/types';

import { Tariff } from '../../db/models/tariff';

export class TariffRepository {
    static async syncTariffs(data: WarehouseTariff[], trx: Knex): Promise<void> {
        const today = new Date().toISOString().split('T')[0];
        const dataWithDate = data.map(item => ({
            ...item,
            date: today,
        }));

        const existsToday = await Tariff.existsForDate(today, trx);

        if (existsToday) {
            console.log('Data for today exists, updating...');
            await Tariff.update(dataWithDate, trx);
        } else {
            console.log('No data for today, inserting new...');
            await Tariff.insert(dataWithDate, trx);
        }
    }

    static async getAll(db: Knex): Promise<TariffType[]> {
        return Tariff.getAll(db);
    }

    static async getByDate(date: string, db: Knex): Promise<TariffType[]> {
        return Tariff.getByDate(date, db);
    }

    static async getToday(db: Knex): Promise<TariffType[]> {
        return Tariff.getToday(db);
    }
}
