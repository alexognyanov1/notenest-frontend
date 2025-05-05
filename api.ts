import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const LOCAL_STORAGE_KEY = "authTokens";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/";

function getTokens(): TokenPair | null {
  const raw =
    typeof window !== "undefined" && localStorage.getItem(LOCAL_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as TokenPair) : null;
}

function setTokens(pair: TokenPair) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pair));
  }
}

function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getTokens();
    if (tokens?.accessToken) {
      config.headers = config.headers || {};
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      } else {
        config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function onRefreshed(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest: any = error.config;

    if (originalRequest?.url?.includes("/users/me")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storedTokens = getTokens();

      if (!storedTokens?.refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post<TokenPair>(
            "/auth/refresh",
            { refreshToken: storedTokens.refreshToken },
            { baseURL: API_BASE_URL }
          );
          setTokens(data);
          onRefreshed(data.accessToken);
          isRefreshing = false;
        } catch (refreshErr) {
          onRefreshed(null);
          clearTokens();
          isRefreshing = false;
          window.location.href = "/login";
          return Promise.reject(refreshErr);
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) return reject(error);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export async function checkAuth(): Promise<boolean> {
  try {
    await api.get("/users/me");
    return true;
  } catch {
    clearTokens();
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/sign-up" &&
      window.location.pathname !== "/"
    ) {
      window.location.replace("/login");
    }
    return false;
  }
}

export { getTokens, setTokens, clearTokens, LOCAL_STORAGE_KEY };
export default api;
