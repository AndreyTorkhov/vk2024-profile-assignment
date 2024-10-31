import axios from "axios";
import { ListItem } from "../types";

export const fetchItems = async (page = 1, limit = 50): Promise<ListItem[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/comments",
    {
      params: { _page: page, _limit: limit },
    }
  );
  return response.data.map((item: { id: number; body: string }) => ({
    id: item.id,
    text: item.body,
  }));
};
