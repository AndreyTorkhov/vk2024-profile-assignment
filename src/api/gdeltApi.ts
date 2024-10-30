// import { api } from "./axios";
import axios from "axios";

interface ListItem {
  id: number;
  text: string;
}

export const fetchItems = async (page = 1, limit = 20): Promise<ListItem[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/comments",
    {
      params: { _page: page, _limit: limit },
    }
  );
  console.log(response);
  return response.data.map((item: { id: number; body: string }) => ({
    id: item.id,
    text: item.body,
  }));
};
