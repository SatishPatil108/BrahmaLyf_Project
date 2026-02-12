import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({ baseURL, timeout: 10000 });

//make auth request
export const makeAuthRequest = async ({
  service,
  method = "GET",
  data = null,
  params = {},
}) => {
  try {
    const response = await axiosClient({
      url: service,
      method,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AUTH_API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};
