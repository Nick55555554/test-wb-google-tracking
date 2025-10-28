import { google } from 'googleapis';
import { Knex } from 'knex';
import path from 'path';

import { TariffRepository } from '@/repositories/tariff-repository';
import { WarehouseTariff } from '@/types';

const SERVICE_PATH = path.join(__dirname, '../../assets/enduring-byte-476519-d3-759200f93022.json');

export class GoogleSheetsService {
    private sheets = google.sheets('v4');
    private auth;
    private spreadsheetId: string;

    constructor(spreadsheetId: string) {
        this.auth = new google.auth.GoogleAuth({
            keyFile: SERVICE_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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
        const sortedTariffs = [...tariffs].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            const aNum = this.parseToNumber(aVal);
            const bNum = this.parseToNumber(bVal);

            if (aNum !== null && bNum !== null) {
                return aNum - bNum;
            }

            if (aNum === null && bNum !== null) return 1;
            if (aNum !== null && bNum === null) return -1;

            return a.warehouseName.localeCompare(b.warehouseName);
        });

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
            new Date().toISOString(),
        ]);

        return [headers, ...rows];
    }

    private parseToNumber(value: any): number | null {
        if (value === null || value === undefined || value === '-') {
            return null;
        }

        if (typeof value === 'number') {
            return value;
        }

        if (typeof value === 'string') {
            const normalizedValue = value.replace(',', '.');
            const parsed = parseFloat(normalizedValue);
            return isNaN(parsed) ? null : parsed;
        }

        return null;
    }
}
