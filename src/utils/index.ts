import { WarehouseTariff } from '@/types';

export const formatReadableDate = (date: Date): string => {
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow',
    });
};

export const parseToNumber = (value: any): number | null => {
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
};

export const sortTariffs = (
    tariffs: WarehouseTariff[],
    sortBy: keyof WarehouseTariff = 'boxDeliveryBase',
): WarehouseTariff[] => {
    return [...tariffs].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        const aNum = parseToNumber(aVal);
        const bNum = parseToNumber(bVal);

        if (aNum !== null && bNum !== null) {
            return aNum - bNum;
        }

        if (aNum === null && bNum !== null) return 1;
        if (aNum !== null && bNum === null) return -1;

        return a.warehouseName.localeCompare(b.warehouseName);
    });
};
