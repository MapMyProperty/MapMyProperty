import request from "utils/request";

const loginUser = async (data) => request('/auth/login', 'POST', data);
const generateBlog = async (data) => request('/ai/generate-blog', 'POST', data);
const addBlogs = async (data) => request(`/blogs`, 'POST', data)
const editBlogs = async (data) => request(`/blogs`, 'PATCH', data)
const deleteBlogs = async (data) => request(`/blogs/${data?._id}`, 'DELETE', data)
const getBlogs = async (data) => request(`/blogs?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getBlogsById = async (data) => request(`/blogs/${data?.id}`, 'GET', data)
const addBanners = async (data) => request(`/banners`, 'POST', data)
const editBanners = async (data) => request(`/banners`, 'PATCH', data)
const deleteBanners = async (data) => request(`/banners/${data?._id}`, 'DELETE', data)
const getBanners = async (data) => request(`/banners?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getBannersById = async (data) => request(`/banners/${data?.id}`, 'GET', data)
const addTags = async (data) => request(`/tags`, 'POST', data)
const editTags = async (data) => request(`/tags`, 'PATCH', data)
const deleteTags = async (data) => request(`/tags/${data?._id}`, 'DELETE', data)
const getTags = async (data) => request(`/tags?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getTagsById = async (data) => request(`/tags/${data?.id}`, 'GET', data)

const updateBlogBanner = async (blogId, banner) => {
  return request(`/blogs/${blogId}/setBanner`, 'PUT', { banner });
};


const editContact = async ({ userId, newStatus }) => request('/contact/update-status', 'PUT', { userId, newStatus })

const getContact = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/contact/getAllContacts?${queryParams}`, 'GET');
  return response;
};
const editProjectEnquiry = async ({ userId, newStatus }) => request('/projectEnquiry/update-status', 'PUT', { userId, newStatus })

const getProjectEnquiry = async ({ page, perPage, sortBy, order, search }) => {
  const queryParams = new URLSearchParams({
    page,
    perPage,
    sortBy,
    order,
    search,
  }).toString();

  const response = await request(`/projectEnquiry/getAllProjectEnquirys?${queryParams}`, 'GET');
  return response;
};

const addSection = async (data) => request(`/section`, 'POST', data)
const editSection = async (data) => request(`/section`, 'PATCH', data)
const deleteSection = async (data) => request(`/section/${data?._id}`, 'DELETE', data)
const getSection = async (data) => request(`/section?page=${data?.pageNo}&perpageitems=${data?.pageCount}`, 'GET', data)
const getSectionById = async (data) => request(`/section/${data?.id}`, 'GET', data)

export {
  addBlogs,
  editBlogs,
  deleteBlogs,
  getBlogs,
  getBlogsById,
  addBanners,
  editBanners,
  deleteBanners,
  getBanners,
  getBannersById,
  getContact,
  editContact,
  getProjectEnquiry,
  editProjectEnquiry,
  addSection,
  editSection,
  deleteSection,
  getSection,
  getSectionById,
  addTags,
  editTags,
  deleteTags,
  getTags,
  getTagsById,
  updateBlogBanner,
  loginUser,
  generateBlog
};
