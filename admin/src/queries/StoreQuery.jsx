import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    updateBlogBanner,
    getBlogs,
    addBlogs,
    getBlogsById,
    editBlogs,
    deleteBlogs,
    addBanners,
    editBanners,
    deleteBanners,
    getBannersById,
    getBanners,
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
    updateUserRole,
    loginUser,
    generateBlog
} from "./storeUrls";

const useGetBlogs = (data) => {
    return useQuery(["get_blogs", data], () => getBlogs(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useGetBlogsById = (data) => {
    return useQuery(["get_blogs", data], () => getBlogsById(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useAddBlogs = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => addBlogs(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_blogs");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useEditBlogs = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => editBlogs(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_blogs");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useDeleteBlogs = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => deleteBlogs(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_blogs");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useGetBanners = (data) => {
    return useQuery(["get_banners", data], () => getBanners(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useGetBannersById = (data) => {
    return useQuery(["get_banners", data], () => getBannersById(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useAddBanners = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => addBanners(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_banners");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useEditBanners = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => editBanners(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_banners");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useDeleteBanners = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => deleteBanners(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_banners");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useGetContact = (params) => {
    return useQuery(["get_contact", params], () => getContact(params), {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};
const useUpdateContactStatus = () => {

    const queryClient = useQueryClient();

    return useMutation(({ userId, newStatus }) => editContact({ userId, newStatus }), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_contact");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useGetProjectEnquiry = (params) => {
    return useQuery(["get_projectEnquiry", params], () => getProjectEnquiry(params), {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};
const useUpdateProjectEnquiryStatus = () => {

    const queryClient = useQueryClient();

    return useMutation(({ userId, newStatus }) => editProjectEnquiry({ userId, newStatus }), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_projectEnquiry");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};



const useGetSection = (data) => {
    return useQuery(["get_section", data], () => getSection(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useGetSectionById = (data) => {
    return useQuery(["get_section", data], () => getSectionById(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useAddSection = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => addSection(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_section");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useEditSection = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => editSection(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_section");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useDeleteSection = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => deleteSection(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_section");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useGetTags = (data) => {
    return useQuery(["get_tags", data], () => getTags(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useGetTagsById = (data) => {
    return useQuery(["get_tags", data], () => getTagsById(data), {
        staleTime: 3000,
        keepPreviousData: true,
        // refetchOnWindowFocus: false,
    });
};

const useAddTags = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => addTags(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_tags");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useEditTags = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => editTags(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_tags");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};

const useDeleteTags = () => {
    const queryClient = useQueryClient();

    return useMutation((data) => deleteTags(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries("get_tags");
            return data;
        },
        onError: (data) => {
            return data;
        },
    });
};
const useUpdateBlogBanner = () => {
    const queryClient = useQueryClient();

    return useMutation(({ blogId, banner }) => updateBlogBanner(blogId, banner), {
        onSuccess: () => {
            queryClient.invalidateQueries("get_blogs");
        },
        onError: (error) => {
            console.error("Error updating banner:", error);
        },
    });
};

const useGenerateBlog = () => {
    return useMutation((data) => generateBlog(data));
};

export {
    useUpdateBlogBanner,
    useGetBlogs,
    useGetBlogsById,
    useAddBlogs,
    useEditBlogs,
    useDeleteBlogs,
    useGetBanners,
    useGetBannersById,
    useAddBanners,
    useEditBanners,
    useDeleteBanners,
    useGetContact,
    useUpdateContactStatus,
    useGetProjectEnquiry,
    useUpdateProjectEnquiryStatus,
    useGetSection,
    useGetSectionById,
    useAddSection,
    useEditSection,
    useDeleteSection,
    useGetTags,
    useGetTagsById,
    useAddTags,
    useEditTags,
    useDeleteTags,
    useGenerateBlog
};
