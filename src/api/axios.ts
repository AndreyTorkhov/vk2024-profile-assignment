import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.gdeltproject.org/api/v2/doc/",
  responseType: "json",
});
