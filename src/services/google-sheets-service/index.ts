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
            const todayTariffs = await TariffRepository.getToday(trx);

            const currentData = await this.sheets.spreadsheets.values.get({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: 'stocks_coefs!A:G',
            });

            const currentValues = currentData.data.values || [];
            const today = new Date().toISOString().split('T')[0];

            if (currentValues.length > 1) {
                const todayDataExists = currentValues.some((row, index) => {
                    if (index === 0) return false;
                    const rowDate = this.extractDateFromRow(row[6]);
                    return rowDate === today;
                });

                if (todayDataExists) {
                    await this.updateTodayData(todayTariffs, sortBy, currentValues);
                } else {
                    await this.appendNewData(todayTariffs, sortBy);
                }
            } else {
                await this.updateExistingSheet(todayTariffs, sortBy);
            }

            console.log("Google Sheets updated successfully with today's data");
        } catch (error) {
            console.error('Error updating Google Sheets:', error);
            throw error;
        }
    }

    private extractDateFromRow(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    }

    private async updateTodayData(
        tariffs: WarehouseTariff[],
        sortBy: keyof WarehouseTariff,
        currentValues: any[][],
    ): Promise<void> {
        const today = new Date().toISOString().split('T')[0];

        const todayRowIndices: number[] = [];
        currentValues.forEach((row, index) => {
            if (index === 0) return;
            const rowDate = this.extractDateFromRow(row[6]);
            if (rowDate === today) {
                todayRowIndices.push(index);
            }
        });

        if (todayRowIndices.length > 0) {
            todayRowIndices.sort((a, b) => b - a);

            const requests = todayRowIndices.map(index => ({
                deleteRange: {
                    range: {
                        sheetId: 0,
                        startRowIndex: index,
                        endRowIndex: index + 1,
                    },
                    shiftDimension: 'ROWS',
                },
            }));

            await this.sheets.spreadsheets.batchUpdate({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests,
                },
            });

            const insertRowIndex = todayRowIndices[todayRowIndices.length - 1];
            await this.insertDataAtRow(tariffs, sortBy, insertRowIndex);
        } else {
            await this.appendNewData(tariffs, sortBy);
        }
    }

    private async insertDataAtRow(
        tariffs: WarehouseTariff[],
        sortBy: keyof WarehouseTariff,
        rowIndex: number,
    ): Promise<void> {
        const values = this.formatDataForSheets(tariffs, sortBy);
        const dataRows = values.slice(1);

        if (dataRows.length > 0) {
            await this.sheets.spreadsheets.values.update({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: `stocks_coefs!A${rowIndex + 1}`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: dataRows,
                },
            });
        }
    }

    private async updateExistingSheet(
        tariffs: WarehouseTariff[],
        sortBy: keyof WarehouseTariff,
    ): Promise<void> {
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
    }

    private async appendNewData(
        tariffs: WarehouseTariff[],
        sortBy: keyof WarehouseTariff,
    ): Promise<void> {
        const values = this.formatDataForSheets(tariffs, sortBy);

        const dataRows = values.slice(1);

        if (dataRows.length > 0) {
            await this.sheets.spreadsheets.values.append({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: 'stocks_coefs!A:G',
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: dataRows,
                },
            });
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

        const currentDate = formatReadableDate(new Date());

        const rows = sortedTariffs.map(tariff => [
            tariff.warehouseName,
            tariff.geoName,
            tariff.boxDeliveryBase,
            tariff.boxDeliveryLiter,
            tariff.boxStorageBase,
            tariff.boxStorageLiter,
            currentDate,
        ]);

        return [headers, ...rows];
    }
}
