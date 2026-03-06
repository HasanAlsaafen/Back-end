import { useContext } from "react";
import { AccessTokenContext } from "../App";

export const useApi = () => {
  const { accessToken, handleSetAccessToken } = useContext(AccessTokenContext);
  const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const request = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    let response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (response.status === 403) {
      try {
        const refreshRes = await fetch(`${URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.token) {
            handleSetAccessToken(data.token);
            
            const retryHeaders = new Headers(options.headers || {});
            retryHeaders.set("Authorization", `Bearer ${data.token}`);
            
            response = await fetch(endpoint, {
              ...options,
              headers: retryHeaders,
            });
          }
        }
      } catch (error) {
        console.error("Refresh token failed", error);
      }
    }

    return response;
  };

  return { request };
};
