import axios from "axios";

// -------------------- AXIOS INSTANCE --------------------

const API = axios.create();

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        // config.headers.Authorization = `Bearer ${token}`;
        config.headers.Authorization = token;
    }

    return config;
});

// -------------------- RESPONSE INTERCEPTOR --------------------

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const isAuthApi = url.includes("login") || url.includes("signup");

        if (status === 401 && !isAuthApi) {
            localStorage.removeItem("access_token");
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

// -------------------- TOKEN --------------------

const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
};

// -------------------- HEADER BUILDER --------------------

const buildHeaders = (extra = {}, options = {}) => {
    const headers = {
        ...extra,
    };

    // ERP KEY CASE
    if (options.useErpKey) {
        headers["ERP-API-KEY"] =
            import.meta.env.VITE_ERP_API_KEY || "";
        return headers;
    }

    // TOKEN CASE
    // const token = getAuthToken();
    // if (token) {
    //     headers.Authorization = `Bearer ${token}`;
    // }

    return headers;
};

// -------------------- ERROR HANDLER --------------------

const handleAxiosError = (error) => {
    const fieldErrors = error.response?.data?.errors;
    const firstFieldError =
        fieldErrors && Object.values(fieldErrors)[0]?.[0];

    const message =
        firstFieldError ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

    // throw new Error(message);
    throw error;
};

// -------------------- GET --------------------

// export const fetchDataGet = async (url, options = {}) => {
//   try {
//     const response = await API.get(url, {
//       headers: buildHeaders({}, options),
//     });
//     return response.data;
//   } catch (e) {
//     handleAxiosError(e);
//   }
// };

export const fetchDataGet = async (url, params = {}, options = {}) => {
    try {
        const response = await API.get(url, {
            params,
            headers: buildHeaders({}, options),
        });
        return response.data;
    } catch (e) {
        handleAxiosError(e);
    }
};

// -------------------- POST --------------------

export const fetchDataPost = async (
    url,
    data = {},
    config = {},
    options = {}
) => {
    try {
        const response = await API.post(url, data, {
            headers: buildHeaders(
                { "Content-Type": "application/json" },
                options
            ),
            ...config,
        });
        return response.data;
    } catch (e) {
        handleAxiosError(e);
    }
};

// -------------------- PUT --------------------

export const fetchDataPut = async (url, data = {}, options = {}) => {
    try {
        const response = await API.put(url, data, {
            headers: buildHeaders(
                { "Content-Type": "application/json" },
                options
            ),
        });
        return response.data;
    } catch (e) {
        handleAxiosError(e);
    }
};

// -------------------- PATCH --------------------

export const fetchDataPatch = async (url, data = {}, options = {}) => {
    try {
        const response = await API.patch(url, data, {
            headers: buildHeaders(
                { "Content-Type": "application/json" },
                options
            ),
        });
        return response.data;
    } catch (e) {
        handleAxiosError(e);
    }
};

// -------------------- DELETE --------------------

export const fetchDataDelete = async (url, options = {}) => {
    try {
        const response = await API.delete(url, {
            headers: buildHeaders({}, options),
        });
        return response.data;
    } catch (e) {
        handleAxiosError(e);
    }
};