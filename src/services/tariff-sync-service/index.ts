import { type Knex } from 'knex';

import { query } from '@/config/api';
import { TariffRepository } from '@/repositories/tariff-repository';
import { WarehouseTariff } from '@/types';

interface BoxTariffResponse {
    response: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: WarehouseTariff[];
        };
    };
}

export class TariffSyncService {
    async syncTariffs(trx: Knex) {
        try {
            const response: BoxTariffResponse = await query.get('/tariffs/box');
            const warehouseList = response.response.data.warehouseList;

            await TariffRepository.upsert(warehouseList, trx);
        } catch (error) {
            console.error('Error in tariff sync:', error);
        }
    }
}
