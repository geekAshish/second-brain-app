import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";

import { refreshTokenAPI, clearTokenAndAccessToken } from "../utils/auth";
import { BACKEND_URL } from "@/config";

// Define the base URL for the API
const REDIRECT_PAGE_URL = "/signin";

// Default headers for API requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Function to get the access token from local storage
const getAccessToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("token") || localStorage.getItem("TOKEN")
    : null;
};

// Function to get the refresh token from local storage
const getRefreshToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("refresh_token") ||
        localStorage.getItem("REFRESH_TOKEN")
    : null;
};

// Function to create an Axios instance with custom headers
const getInstance = (
  customHeaders: AxiosRequestConfig["headers"] = {}
): AxiosInstance => {
  // Combine default headers with custom headers
  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  };

  // Add authorization header with the access token
  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Create and configure the Axios instance
  const instance = axios.create({
    baseURL: BACKEND_URL,
    headers,
  });

  // Add response interceptors for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      // Handle token expiration scenario (error.response.status === 400)
      if (error.response && error.response.status === 401) {
        const refreshTokenValue = getRefreshToken();
        // console.log("token expire : refresh token value", refreshTokenValue);
        if (refreshTokenValue) {
          try {
            // Refresh the access token using the refresh token
            const newAccessToken = await refreshTokenAPI();
            // Retry the failed request with the new access token
            // console.log("token expire : new access token : ", newAccessToken);
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(error.config);
          } catch (refreshError) {
            if (refreshError === "Refresh token expired") {
              // Redirect to login page if refresh token is expired
              clearTokenAndAccessToken();

              window.location.href = REDIRECT_PAGE_URL;
              // console.log("token expire : 1");
            } else {
              // Handle other token refresh errors (e.g., redirect to login page)
              clearTokenAndAccessToken();
              return Promise.reject(refreshError);
            }
          }
        } else {
          clearTokenAndAccessToken();
          window.location.href = REDIRECT_PAGE_URL;
          // console.log("token expire : 2");
        }
      }

      // For other errors, reject with the error response
      return Promise.reject(
        error?.response?.data?.error || error?.response || error?.message
      );
    }
  );

  return instance;
};

// Interface for specifying additional options in requests
interface RequestOptions extends AxiosRequestConfig {
  params?;
}

// Function to build a query string from parameters
const buildQueryString = (params): string => {
  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        // If value is an array, encode each element and join with '&'
        return value
          .map(
            (element) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(element)}`
          )
          .join("&");
      } else {
        // If value is a string, encode key and value
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          value as string
        )}`;
      }
    })
    .join("&");

  return queryString ? `?${queryString}` : "";
};

// Client object with methods for making API requests
export const Client = {
  // GET request
  get: (
    endpoint: string,
    config: RequestOptions = {}
  ): Promise<AxiosResponse> => {
    // Build the query string from parameters
    const queryString = buildQueryString(config.params || {});
    // Create an Axios instance with custom headers
    const instance = getInstance(config.headers);
    // Make a GET request with the built URL
    return instance.get(`${endpoint}${queryString}`);
  },

  // POST request
  post: (
    endpoint: string,
    data,
    config: RequestOptions = {}
  ): Promise<AxiosResponse> => {
    // Build the query string from parameters
    const queryString = buildQueryString(config.params || {});
    // Create an Axios instance with custom headers
    const instance = getInstance(config.headers);

    // If there is a query string, convert the request to a GET request
    if (queryString) {
      return Client.get(`${endpoint}${queryString}`, {
        ...config,
        method: "GET",
      });
    }

    // Otherwise, make a POST request with the data
    return instance.post(endpoint, data, { params: config.params });
  },

  // DELETE request
  delete: (
    endpoint: string,
    data,
    config: RequestOptions = {}
  ): Promise<AxiosResponse> => {
    // Build the query string from parameters
    const queryString = buildQueryString(config.params || {});
    // Create an Axios instance with custom headers
    const instance = getInstance(config.headers);

    // If there is a query string, convert the request to a DELETE request
    if (queryString) {
      return Client.get(`${endpoint}${queryString}`, {
        ...config,
        method: "DELETE",
      });
    }

    // Otherwise, make a DELETE request with the data
    return instance.delete(endpoint, { data });
  },

  // PUT request
  put: (
    endpoint: string,
    data,
    config: RequestOptions = {}
  ): Promise<AxiosResponse> => {
    // Build the query string from parameters
    const queryString = buildQueryString(config.params || {});
    // Create an Axios instance with custom headers
    const instance = getInstance(config.headers);

    // If there is a query string, convert the request to a PUT request
    if (queryString) {
      return Client.get(`${endpoint}${queryString}`, {
        ...config,
        method: "PUT",
      });
    }

    // Otherwise, make a PUT request with the data
    return instance.put(endpoint, data, { params: config.params });
  },
};
