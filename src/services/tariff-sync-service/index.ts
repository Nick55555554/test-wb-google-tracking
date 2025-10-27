import { query } from "@/config/api";
import { TariffRepository } from "@/repositories/tariff";
import { WarehouseTariff } from "@/types";
import { type Knex } from "knex";
import cron from 'node-cron';


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
  static async syncTariffs(db: Knex) {
    try {
      
      const response: BoxTariffResponse = await query.get('/tariffs/box');
      const warehouseList = response.response.data.warehouseList;

      await TariffRepository.upsert(warehouseList, db);
    } catch (error) {
      console.error('Error in tariff sync:', error);
    }
  }

  static startHourlySync(db: any) {
    this.syncTariffs(db);

    cron.schedule('0 * * * *', () => {
      this.syncTariffs(db);
    });

    console.log('Hourly tariff sync scheduler started');
  }
}