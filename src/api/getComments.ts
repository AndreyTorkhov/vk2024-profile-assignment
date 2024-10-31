import axios from "axios";
import { ListItem } from "../types";

export const fetchItems = async (page = 1): Promise<ListItem[]> => {
  const response = await axios.get(`https://api.github.com/orgs/github/repos`, {
    params: { page },
  });

  return response.data.map((item: { id: number; name: string }) => ({
    id: item.id,
    text: item.name,
  }));
};
