export type Voucher = {
    "id": number,
    "code": string,
    "type": "PERCENTAGE" | "FIXED",
    "value": number,
    "minOrderValue": number,
    "maxDiscountValue": number,
    "usageLimit": number,
    "usedCount": number,
    "promotion": {
        "id": number,
        "name": string,
        "startDate": string,
        "endDate": string
    }
}