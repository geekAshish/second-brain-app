import { BACKEND_URL } from "@/config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = BACKEND_URL;
const REDIRECT_PAGE_URL = "/signin";

export const clearTokenAndAccessToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.clear();
};

export const getValueFromToken = (key: any) => {
  const token = localStorage.getItem("access_token");
  const jwtObject = token && jwtDecode(token);
  const value = jwtObject?.[key];
  return value;
};

export const checkTokenExpireBeforeOneDay = () => {
  const tokenExpirySecond = getValueFromToken("exp");
  const currentDateSecond = Date.now() / 1000;
  const oneDayInSeconds = 24 * 60 * 60;

  const currentDate = new Date(Date.now());
  const humanReadableCurrentDate = currentDate.toLocaleString();

  const tokenExpiry = new Date(tokenExpirySecond * 1000);
  const humanReadableDate = tokenExpiry.toLocaleString();

  console.log("token expiry details", {
    exp: humanReadableDate,
    current: humanReadableCurrentDate,
    expiresBeforeOneDay:
      tokenExpirySecond - currentDateSecond <= oneDayInSeconds,
  });
};

// Function to validate a JWT token
const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    }
  } catch (error) {
    console.error("Token Expired:", error);
  }
  return false;
};

// Function to refresh the access token using the refresh token
export const refreshTokenAPI = async (): Promise<
  (() => Promise<void>) | null
> => {
  try {
    const refreshToken =
      localStorage.getItem("refresh_token") ||
      localStorage.getItem("REFRESH_TOKEN");

    if (refreshToken) {
      const refreshValid = isTokenValid(refreshToken);
      // console.log("token expire : refresh Valid", refreshValid);

      if (refreshValid) {
        // If refresh token is valid, send a request to refresh the token
        const response = await axios.get(
          `${BASE_URL}/api/v1/auth/refresh-token`,
          {
            headers: {
              token: `Bearer ${refreshToken}`,
            },
          }
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data?.payload?.token || "";

        // Store the new tokens in local storage
        localStorage.setItem("access_token", newAccessToken?.token);
        localStorage.setItem("refresh_token", newRefreshToken?.token);
        return newAccessToken?.token;
      } else {
        // If refresh token is expired or invalid, redirect to the login page
        clearTokenAndAccessToken();
        window.location.href = REDIRECT_PAGE_URL;
        // console.log("token expire : refreshTokenAPI : 1");

        return null;
      }
    } else {
      // If refresh token doesn't exist, redirect to the login page
      clearTokenAndAccessToken();
      window.location.href = REDIRECT_PAGE_URL;
      // console.log("token expire : refreshTokenAPI : 2");
      return null;
    }
  } catch (error) {
    console.error("Error while refreshing token:", error);
    // Redirect to the login page in case of an error
    clearTokenAndAccessToken();
    window.location.href = REDIRECT_PAGE_URL;
    // console.log("token expire : refreshTokenAPI : 3");
    return null;
  }
};
