import { google } from 'googleapis';
import { Knex } from 'knex';

import { TariffRepository } from '@/repositories/tariff-repository';
import { WarehouseTariff } from '@/types';
import { formatReadableDate, sortTariffs } from '@/utils';

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SCOPES } = process.env;

export class GoogleSheetsService {
    private sheets = google.sheets('v4');
    private auth;
    private spreadsheetId: string;

    constructor(spreadsheetId: string) {
        if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
            throw new Error(
                'Missing required environment variables: GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY',
            );
        }

        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [GOOGLE_SCOPES!],
        });
        this.spreadsheetId = spreadsheetId;
    }

    public async updateTariffs(
        trx: Knex,
        sortBy: keyof WarehouseTariff = 'boxDeliveryBase',
    ): Promise<void> {
        try {
            const tariffs = await TariffRepository.getAll(trx);

            console.log(`Updating Google Sheets with ${tariffs.length} tariffs...`);

            const range = 'stocks_coefs!A1';
            const values = this.formatDataForSheets(tariffs, sortBy);

            await this.sheets.spreadsheets.values.update({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range,
                valueInputOption: 'RAW',
                requestBody: {
                    values,
                },
            });

            console.log('Google Sheets updated successfully');
        } catch (error) {
            console.error('Error updating Google Sheets:', error);
            throw error;
        }
    }

    private formatDataForSheets(
        tariffs: WarehouseTariff[],
        sortBy: keyof WarehouseTariff = 'boxDeliveryBase',
    ): any[][] {
        const sortedTariffs = sortTariffs(tariffs, sortBy);

        const headers = [
            'Warehouse Name',
            'Geo Name',
            'Box Delivery Base',
            'Box Delivery Liter',
            'Box Storage Base',
            'Box Storage Liter',
            'Updated At',
        ];

        const rows = sortedTariffs.map(tariff => [
            tariff.warehouseName,
            tariff.geoName,
            tariff.boxDeliveryBase,
            tariff.boxDeliveryLiter,
            tariff.boxStorageBase,
            tariff.boxStorageLiter,
            formatReadableDate(new Date()),
        ]);

        return [headers, ...rows];
    }
}
