import axiosInstance from "@/utils/axiosInstance"


export const getIndustries = async () => {

    const response = await axiosInstance.get("/industries")
    return response.data

}


export const getCategoriesByIndustry = async (industry_name: string) => {

    const response = await axiosInstance.get(`industries/${industry_name}/categories`)

    return response.data;
}