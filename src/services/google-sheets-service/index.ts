import { google } from 'googleapis';

export class GoogleSheetsService {
  private static sheets = google.sheets('v4');
  private static auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  static async updateTariffs(tariffs: WarehouseTariff[]) {
    try {
      const spreadsheetId = 'your-spreadsheet-id';
      const range = 'Sheet1!A:Z';

      const values = this.formatDataForSheets(tariffs);

      await this.sheets.spreadsheets.values.update({
        auth: this.auth,
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      throw error;
    }
  }

  private static formatDataForSheets(tariffs: WarehouseTariff[]): any[][] {
    // Заголовки
    const headers = [
      'Warehouse Name',
      'Geo Name',
      'Box Delivery Base',
      'Box Delivery Liter',
      'Box Storage Base',
      'Box Storage Liter',
      'Updated At'
    ];

    const rows = tariffs.map(tariff => [
      tariff.warehouseName,
      tariff.geoName,
      tariff.boxDeliveryBase,
      tariff.boxDeliveryLiter,
      tariff.boxStorageBase,
      tariff.boxStorageLiter,
      new Date().toISOString()
    ]);

    return [headers, ...rows];
  }
}