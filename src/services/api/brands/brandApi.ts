import axiosInstance from "@/utils/axiosInstance";
import { LAMBDA_URL } from "@/utils/constants";
import { generateUUID } from "@/utils/functions";

export const postBrandUser = async (
  data: any,
  brand_id: string
): Promise<void> => {
  const apiUrl = `${LAMBDA_URL}/brand-users`;
  console.log("data>", data);

  try {
    const response = await axiosInstance.post(
      apiUrl,

      {
        id: generateUUID(),
        brand_id: brand_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password_hash: "Password1!",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error during API call:", error);
  }
};

// Define the expected structure of the response
interface BrandUserResponse {
  name: string;
  email: string;
  phone: string;
  password_hash?: string;
}

export const putBrandUser = async (
  data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  },
  brand_id: string
): Promise<BrandUserResponse> => {
  const apiUrl = `${LAMBDA_URL}/brand-users/${brand_id}`;
  console.log("Brand ID:", brand_id);

  try {
    const response = await axiosInstance.put(
      apiUrl,
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password_hash: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data as BrandUserResponse;
  } catch (error: any) {
    console.error(
      "Error during API call:",
      error.response?.data || error.message
    );

    // Optionally throw an error for the caller to handle
    throw new Error(
      error.response?.data?.message || "Failed to update the brand user"
    );
  }
};

export const postBrandData = async (data: any): Promise<string> => {
  const apiUrl = `${LAMBDA_URL}/v1/brands`;

  try {
    const response = await axiosInstance.post(
      apiUrl,
      {
        id: generateUUID(),
        name: data.name,
        category_name: data.category_name,
        subcategories: data.subcategories,
        description: data.description,
        email: data.email,
        social_links: data.social_links,
        website_url: data.website_url,
        logo_url: data.logo_url,
        banner_url: data.banner_url,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Brand API Response:", response.data);
    return response.data.id; // Ensure you're returning the brand ID (string)
  } catch (error) {
    console.error("Error during Brand API call:", error);
    throw error;
  }
};

export const getBrandData = async (brandId: string): Promise<any> => {
  const apiUrl = `${LAMBDA_URL}/v1/brands/${brandId}`;
  try {
    const response = await axiosInstance.get(apiUrl);
    console.log("Brand API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during Brand API call:", error);
    throw error;
  }
};

export const getBrandUser = async (brandId: string): Promise<any> => {
  const apiUrl = `${LAMBDA_URL}/brand-users/${brandId}`;
  try {
    const response = await axiosInstance.get(apiUrl);
    console.log("Brand API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during Brand API call:", error);
    throw error;
  }
};
