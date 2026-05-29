export type Package = {
    id: number;
    members: {
        min: number | null;
        max: number | null;
    },
    price_monthly: number;
}