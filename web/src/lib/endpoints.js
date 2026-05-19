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
    update: `${baseUrl}/v1/project/update-timelines`, // PUT
  },
  project: {
    add: `${baseUrl}/v1/project/create-project`, // POST
    list: `${baseUrl}/v1/projects/get-all-project`, // GET
    projectById: `${baseUrl}/v1/project/get-project-by/:id`, // GET
    stepstatusupdate: `${baseUrl}/v1/project/step-status-update`, // put
  },

  getAllStepRole: (project_id) =>
    `${baseUrl}/v1/projects/${project_id}/step-roles`,  // GET

  alladmin: {
    list: `${baseUrl}/v1/superadmin/get-all-admin`, // GET
  },

  allrole: {
    add: `${baseUrl}/v1/superadmin/create-roles`, // POST
    list: `${baseUrl}/v1/superadmin/get-all-roles`, // GET
  },

  approveUser: {
    list: `${baseUrl}/v1/superadmin/approve-uesrs`, // PUT
  },

  assignrole: {
    add: `${baseUrl}/v1/project/assign-step-roles`, // post
  },

  assigncompalinrole: {
    add: `${baseUrl}/v1/project/assign-complaint-roles`, // post
  },
  getComplaintRoles: (project_id) =>
    `${baseUrl}/v1/projects/${project_id}/complaint-roles`, // GET

  complaint: {
    add: `${baseUrl}/v1/project/create-complaint`,
  },

  getAllComplaint: (project_id) =>
    `${baseUrl}/v1/projects/${project_id}/complaints`,
};





export { baseUrl, apiPrefix };
export default endpoints;
