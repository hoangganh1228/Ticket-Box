export interface EventResponse {
    id: number;
    name: string;
    imageUrl: string | null;
    orgLogoUrl: string | null;
    day: string | null;
    price: number | null;
    deeplink: string | null;
    isFree: boolean;
}

export interface CategoryResponse {
    cateId: number;
    code: string;
    title: {
        en: string;
        vi: string;
    };
    events: EventResponse[];
}
