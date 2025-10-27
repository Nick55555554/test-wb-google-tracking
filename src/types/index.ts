export interface Tariff {
    id: string;
    warehouseName: string;
    geoName: string;
    boxDeliveryBase: string;
    boxDeliveryCoefExpr: string;
    boxDeliveryLiter: string;
    boxDeliveryMarketplaceBase: string;
    boxDeliveryMarketplaceCoefExpr: string;
    boxDeliveryMarketplaceLiter: string;
    boxStorageBase: string;
    boxStorageCoefExpr: string;
    boxStorageLiter: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type WarehouseTariff = Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'>;