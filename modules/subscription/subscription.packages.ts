import { Package } from "./subscription.types";

export const packages: Package[] = [
    {
        id: 0,
        members: {
            min: 0,
            max: 0
        },
        price_monthly: 0
    },
    {
        id: 1,
        members: {
            min: 4,
            max: 10
        },
        price_monthly: 35
    },
    {
        id: 2,
        members: {
            min:11,
            max: 20
        },
        price_monthly: 45
    },
    {
        id: 3,
        members: {
            min: 21,
            max: 50
        },
        price_monthly: 55
    },
    {
        id: 4,
        members: {
            min: 51,
            max: 1000
        },
        price_monthly: 65
    }
]