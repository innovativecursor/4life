const baseURLLive = "http://localhost:10005";
const baseURLDev = "http://localhost:10005";

const isLive = true;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const apiPrefix = "/v1";

const full = (path) => `${baseUrl}${apiPrefix}${path}`;

const endpoints = {
  // ---------- AUTH ----------
  auth: {
    googleLogin: `${baseUrl}/v1/auth/google/callback`, // GET
  },
};

export { baseUrl, apiPrefix };
export default endpoints;
