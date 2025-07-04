
import axiosInstance from "@/utils/axiosInstance";



/* Todo: need to look into this */
export const createOutlet = async (brand_id: string, data: any) => {

    console.log("data", data)
    brand_id = brand_id.replace(/"/g, "");
    const URL = `/v1/outlets`;

    const opening_hours: Record<string, string> = {};

    data.days_open.map((day: string) => {

        opening_hours[day] = `${data.opening_hours} - ${data.closing_hours}`;
    });

    const allDays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const closed_days = allDays.filter(day => !opening_hours.hasOwnProperty(day));



    const latitude = data.location.lat
    const longitude = data.location.lng



    delete data.location;
    delete data.days_open;
    delete data.closing_hours;

    console.log("data>>", data)

    const response = await axiosInstance.post(URL,
        { ...data, brand_id: brand_id, opening_hours, latitude, longitude, closed_days });

    return response.data;
};

export const getOutlet = async (id: string) => {
    const URL = `/v1/outlets/${id}`;
    const response = await axiosInstance.get(URL);

    return response.data;
};

export const updateOutlet = async (id: string, data: any) => {
    const URL = `/v1/outlets/${id}`;
    const response = await axiosInstance.patch(URL, data);

    return response.data;
};

export const deleteOutlet = async (id: string) => {
    const URL = `/v1/outlets/${id}`;
    const response = await axiosInstance.delete(URL);

    return response.data;
};

export const getOutlets = async (brand_id: string) => {
    brand_id = brand_id.replace(/"/g, "");

    const URL = `/v1/outlets?brand_id=${brand_id}`;
    const response = await axiosInstance.get(URL);
    console.log("response outlets", response)
    return response.data;
};