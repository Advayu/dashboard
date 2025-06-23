import { LAMBDA_URL } from "@/utils/constants";
import axios from "axios";

/* create outlet */
export const createOutlet = async (data: any) => {

    const URL = `${LAMBDA_URL}/v1/outlets`;
    const response = await axios.post(URL, data, {
        withCredentials: true,
    });

    return response.data;
}


/* update outlet */
export const updateOutlet = async (data: any) => {
    const URL = `${LAMBDA_URL}/v1/outlets`;
    const response = await axios.patch(URL, data, {
        withCredentials: true,
    });
    return response.data;
}

/* delete outlet */
export const deleteOutlet = async (data: any) => {
    const URL = `${LAMBDA_URL}/v1/outlets`;
    const response = await axios.delete(URL, {
        data,
        withCredentials: true,
    });
    return response.data;
}