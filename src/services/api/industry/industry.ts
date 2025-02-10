import axios from "axios";
import { LAMBDA_URL } from "@/utils/constants";


interface Industry {
    name: string;
    id: string;
    category: []
}

interface Category {
    name: string,
    id: string,
    industryId: string

}

export const getAllIndustry = async () => {
    const response = await axios.get(
        `${LAMBDA_URL}/industries`
    );
    console.log("response", response);
    return response.data.map((item: Industry) => item.name
    )
};

export const getCategoriesByIndustryName = async (name: string) => {
    console.log("industry name", name);
    if (!name) {
        return []
    }
    const response = await axios.get(
        `${LAMBDA_URL}/industries/${name}/categories`
    );
    console.log("response in the industry", response.data);
    return response.data.map((item: Category) => item.name);
}

