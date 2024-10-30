import { makeAutoObservable } from "mobx";
import { fetchNews } from "../api/gdeltApi";
import { NewsItemType } from "../types";

class NewsStore {
  news: NewsItemType[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadNews() {
    this.loading = true;
    try {
      this.news = await fetchNews();
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      this.loading = false;
    }
  }
}

export default new NewsStore();
