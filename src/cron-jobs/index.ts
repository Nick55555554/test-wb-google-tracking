import { Knex } from 'knex';
import cron from 'node-cron';

import { GoogleSheetsService } from '@/services/google-sheets-service';
import { TariffSyncService } from '@/services/tariff-sync-service';

export class SyncJob {
    private googleSheetsService: GoogleSheetsService;
    private tariffSyncService: TariffSyncService;
    private isRunning = false;

    constructor(spreadsheetId: string) {
        this.tariffSyncService = new TariffSyncService();
        this.googleSheetsService = new GoogleSheetsService(spreadsheetId);
    }

    public syncAndExport(db: Knex) {
        this.runSync(db).catch(error => {
            console.error('Error in initial sync:', error);
        });

        cron.schedule('0 * * * *', async () => {
            await this.runSync(db);
        });

        console.log('Starting sync schedule (immediate + every minute)...');
    }

    private async runSync(db: Knex): Promise<void> {
        if (this.isRunning) {
            console.log('Sync already running, skipping...');
            return;
        }

        this.isRunning = true;
        try {
            console.log('Starting sync at:', new Date().toISOString());

            await db.transaction(async trx => {
                await this.tariffSyncService.syncTariffs(trx);
                await this.googleSheetsService.updateTariffs(trx);
            });

            console.log('Sync completed successfully at:', new Date().toISOString());
        } catch (error) {
            console.error('Error in sync:', error);
        } finally {
            this.isRunning = false;
        }
    }
}
