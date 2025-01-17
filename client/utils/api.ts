import request from "./axiosInstance";
import { BannerType, BuilderType, ProjectType, SectionType } from "./interface";

const buildQueryParams = (data: Record<string, number | string>) =>
  new URLSearchParams(
    Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value.toString();
      return acc;
    }, {} as Record<string, string>)
  ).toString();

const getBanner = async (
  data: any
): Promise<{ data: { data: BannerType[] } }> =>
  request({
    endpoint: `/banners/store?${buildQueryParams(data)}`,
    method: "GET",
  });

const getSections = async (
  data: any
): Promise<{ data: { data: SectionType[] } }> =>
  request({
    endpoint: `/section/store?${buildQueryParams(data)}`,
    method: "GET",
  });

const getProjects = async (
  data: any
): Promise<{ data: { docs: ProjectType[] } }> =>
  request({
    endpoint: `/projects?${buildQueryParams(data)}`,
    method: "GET",
  });

const getProjectById = async (
  data: any
): Promise<{ data: { data: ProjectType } }> =>
  request({
    endpoint: `/projects/${data}`,
    method: "GET",
  });

const getBuilderById = async (
  data: any
): Promise<{ data: { data: BuilderType } }> =>
  request({
    endpoint: `/builders/${data}`,
    method: "GET",
  });

const sendInquiry = async (data: any) =>
  request({ endpoint: `/contact`, method: "POST", data });

export {
  getBanner,
  getSections,
  getProjects,
  getProjectById,
  getBuilderById,
  sendInquiry,
};
