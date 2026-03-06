import { useContext, useEffect, useState } from "react";
import { AccessTokenContext } from "../App";

export const useAuth = () => {
  const { accessToken, handleSetAccessToken } =
    useContext(AccessTokenContext);

  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          handleSetAccessToken(data.token);
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (!accessToken) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return {
    isAuthenticated: !!accessToken,
    loading,
  };
};
