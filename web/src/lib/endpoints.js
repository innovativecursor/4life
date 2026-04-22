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

  timeline: {
    add: `${baseUrl}/v1/project/add-timeline`, // POST
    list: `${baseUrl}/v1/project/get-all-timelines`, // GET
  },
  project: {
    add: `${baseUrl}/v1/project/create-project`, // POST
  },

  alladmin: {
    list: `${baseUrl}/v1/superadmin/get-all-admin`, // GET
  },

  allrole: {
    list: `${baseUrl}/v1/superadmin/get-all-roles`, // GET
  },
};

export { baseUrl, apiPrefix };
export default endpoints;
