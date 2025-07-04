import { LAMBDA_URL } from "@/utils/constants";
import { generateUUID } from "@/utils/functions";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const postOutletData = async (
  data: any,
  brand_id: string
): Promise<void> => {
  const apiUrl = `${LAMBDA_URL}/v1/outlets`;

  const opening_hours: Record<string, string> = {};

  data.days_open.map((day: string) => {

    opening_hours[day] = `${data.opening_time} - ${data.closing_time}`;
  });

  console.log(opening_hours);
  console.log("data>", data);
  console.log("brand_id>", brand_id);

  try {
    // Prepare the data by adding the generated UUID
    const requestData = {
      id: generateUUID(),
      // Add the generated UUID here
      brand_id: brand_id,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      // phone: data.country_code + data.phone,
      neighborhood: data.neighborhood,
      street: data.street,
      postal_code: data.postal_code,

      manager_name: data.manager_name,
      manager_phone: "+91" + data.manager_phone,

      services: data.services,
      amenities: data.amenities,
      accessibility_features: data.accessibility_features,
      images: data.images,
      opening_hours: opening_hours,
    };

    // Make the API request
    const response = await axiosInstance.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error during API call:", error);
  }
};

export const patchOutletData = async (
  data: any,
  outlet_id: string
): Promise<number> => {
  const apiUrl = `${LAMBDA_URL}/v1/outlets/${outlet_id}`;

  console.log("data>", data);
  console.log("outletd id>", outlet_id);

  data.days_open.map((day: string) => {
    // opening_hours[day] = data.opening_hours[day]
    data.opening_hours[day] = `${data.opening_time} - ${data.closing_time}`;
  });

  try {
    // Prepare the data by adding the generated UUID
    const requestData = {
      // id: generateUUID(),
      // Add the generated UUID here
      // brand_id: data.brand_id,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      // phone: data.country_code + data.phone,
      neighborhood: data.neighborhood,
      street: data.street,
      postal_code: data.postal_code,

      manager_name: data.manager_name,
      manager_phone: "+91" + data.manager_phone,

      services: data.services,
      amenities: data.amenities,
      accessibility_features: data.accessibility_features,
      images: data.images,
      opening_hours: data.opening_hours,
    };

    // Make the API request
    const response = await axiosInstance.patch(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("API Response:", response);
    return response.status;
  } catch (error) {
    console.error("Error during API call:", error);
    return 400;
  }
};
