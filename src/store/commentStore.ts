import { makeAutoObservable } from "mobx";
import { fetchItems } from "../api/getComments";

export interface Comment {
  id: number;
  text: string;
}

export class CommentStore {
  comments: Comment[] = [];
  page = 1;

  constructor() {
    makeAutoObservable(this);
  }

  async loadComments() {
    try {
      const initialComments = await fetchItems(this.page, 250);
      this.comments = initialComments;
    } catch (error) {
      console.error("Ошибка загрузки начальных комментариев:", error);
    }
  }

  async loadMoreComments() {
    try {
      this.page += 1;
      const additionalComments = await fetchItems(this.page, 50);
      this.comments = [...this.comments, ...additionalComments];
    } catch (error) {
      console.error("Ошибка подгрузки дополнительных комментариев:", error);
    }
  }

  updateComment(id: number, newText: string) {
    const comment = this.comments.find((c) => c.id === id);
    if (comment) comment.text = newText;
  }

  deleteComment(id: number) {
    this.comments = this.comments.filter((c) => c.id !== id);
  }
}
