import request from "utils/request";

const addCategory = async (data) => request(`/category`, 'POST', data)
const editCategory = async (data) => request(`/category`, 'PATCH', data)
const deleteCategory = async (data) => request(`/category/${data?._id}`, 'DELETE', data)
const getCategoryById = async (data) => request(`/category/${data?.id}`, 'GET', data)
const getCategory = async (data) => request(`/category?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getFilterCategory = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/category/adminCategory?${queryParams}`, 'GET');
  return response;
};

const addBuilders = async (data) => request(`/builders`, 'POST', data)

const addProjects = async (data) => request(`/projects`, 'POST', data)
const generateProjectAI = async (data) => request(`/ai/generate-project`, 'POST', data)
const updateProjects = async (data) => request(`/projects`, 'PATCH', data)
const updateBuilders = async (data) => request(`/builders`, 'PATCH', data)
const deleteProjects = async (data) => request(`/projects/${data?._id}`, 'DELETE', data)
const getProjectsById = async (data) => request(`/projects/${data?.id}`, 'GET', data)
const getBuildersById = async (data) => request(`/builders/${data?.id}`, 'GET', data)
const getSelectBuilders = async (data) => request(`/builders?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getSelectProjects = async (data) => request(`/projects/listingProjects?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getProjects = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/projects/adminProjects?${queryParams}`, 'GET');
  return response;
};
const getBuilders = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/builders/adminbuilders?${queryParams}`, 'GET');
  return response;
};

const getAnalytics = async () => request(`/analytics/dashboard-stats`, 'GET');

export {
  addCategory,
  getCategoryById,
  editCategory,
  deleteCategory,
  addProjects,
  updateProjects,
  deleteProjects,
  getCategory,
  getFilterCategory,
  getProjects,
  getProjectsById,
  getSelectProjects,
  addBuilders,
  getBuilders,
  getBuildersById,
  updateBuilders,
  getSelectBuilders,
  generateProjectAI,
  getAnalytics
};
