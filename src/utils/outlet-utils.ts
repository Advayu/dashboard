// utils/outlet-utils.ts

export type RawOutletForm = {
    days_open?: string[];
    opening_hours?: string;
    closing_hours?: string;
    location?: { lat: number; lng: number };
    [key: string]: any;
};

export function sanitizeOutletPayload(rawData: RawOutletForm, brandId?: string) {
    const data = { ...rawData }; // shallow copy

    const opening_hours: Record<string, string> = {};
    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (data.days_open && data.opening_hours && data.closing_hours) {
        data.days_open.forEach((day) => {
            opening_hours[day] = `${data.opening_hours} - ${data.closing_hours}`;
        });
    }

    const closed_days = allDays.filter(day => !opening_hours.hasOwnProperty(day));

    const latitude = data.location?.lat;
    const longitude = data.location?.lng;

    // Clean up unused keys
    delete data.location;
    delete data.days_open;
    delete data.closing_hours;

    return {
        ...data,
        ...(brandId && { brand_id: brandId }),
        opening_hours,
        latitude,
        longitude,
        closed_days,
    };
}
