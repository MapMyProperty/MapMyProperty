import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addCategory,
  getFilterCategory,
  getCategoryById,
  editCategory,
  deleteCategory,
  addProjects,
  deleteProjects,
  deleteBuilders,
  getCategory,
  getProjectsById,
  getProjects,
  updateProjects,
  getSelectProjects,
  addBuilders,
  getBuilders,
  getSelectBuilders,
  getBuildersById,
  updateBuilders,
  generateProjectAI,
  generateProjectBlog
} from "./productUrls";

const useGetCategory = (data) => {
  return useQuery(["get_category", data], () => getCategory(data), {
    staleTime: 3000,
    keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
};

const useGetFilterCategory = (params) => {
  return useQuery(["get_category", params], () => getFilterCategory(params), {
    staleTime: 3000,
    keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
};


const useGetCategorysById = (data) => {
  return useQuery(["get_category", data], () => getCategoryById(data), {
    staleTime: 3000,
    keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
};

const useEditCategorys = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => editCategory(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_category");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useDeleteCategorys = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => deleteCategory(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_category");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useGetProjects = (params) => {
  return useQuery(["get_Projects", params], () => getProjects(params), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
const useGetBuilders = (params) => {
  return useQuery(["get_Builders", params], () => getBuilders(params), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
const useGetSelectBuilders = (data) => {
  return useQuery(["get_Builders", data], () => getSelectBuilders(data), {
    staleTime: 3000,
    keepPreviousData: true,
  });
};

const useGetBuildersById = (data) => {
  return useQuery(["get_Builders", data], () => getBuildersById(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
const useGetProjectsById = (data) => {
  return useQuery(["get_Projects", data], () => getProjectsById(data), {
    // staleTime: 30000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};


const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addCategory(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_category");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useAddProjects = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addProjects(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Projects");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useAddBuilders = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => addBuilders(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Builders");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useGenerateProjectAI = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => generateProjectAI(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Projects");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useGenerateProjectBlog = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => generateProjectBlog(data), {
    onSuccess: (data) => {
      // Invalidate fetching projects so the blog link is updated
      queryClient.invalidateQueries("get_Projects");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useUpdateProjects = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => updateProjects(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Projects");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useUpdateBuilders = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => updateBuilders(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Builders");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};
const useDeleteProjects = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => deleteProjects(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Projects");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useDeleteBuilders = () => {
  const queryClient = useQueryClient();

  return useMutation((data) => deleteBuilders(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_Builders");
      return data;
    },
    onError: (data) => {
      return data;
    },
  });
};

const useGetSelectProjects = (data) => {
  return useQuery(["get_Projects", data], () => getSelectProjects(data), {
    staleTime: 3000,
    keepPreviousData: true,
  });
};


export {
  useGetCategory,
  useGetFilterCategory,
  useEditCategorys,
  useGetCategorysById,
  useDeleteCategorys,
  useGetProjects,
  useGetProjectsById,
  useGetBuildersById,
  useAddCategory,
  useAddProjects,
  useUpdateProjects,
  useDeleteProjects,
  useDeleteBuilders,
  useGetSelectProjects,
  useAddBuilders,
  useGetBuilders,
  useUpdateBuilders,
  useGetSelectBuilders,
  useGenerateProjectAI,
  useGenerateProjectBlog
};