import { api } from "./axios";

interface NewsQueryParams {
  query?: string;
  mode?: string;
  sort?: string;
  maxrecords?: number;
  format?: string;
}

export const fetchNews = async (params: NewsQueryParams = {}) => {
  const response = await api.get("doc", {
    params: {
      query: params.query || "technology",
      mode: params.mode || "artlist",
      sort: params.sort || "datedesc",
      maxrecords: params.maxrecords || 100,
      format: params.format || "json",
    },
  });
  //   console.log(response);
  return response.data.articles;
};
