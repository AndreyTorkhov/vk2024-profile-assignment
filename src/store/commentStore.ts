import { makeAutoObservable } from "mobx";
import { fetchItems } from "../api/getComments";

export interface Comment {
  id: number;
  text: string;
}

export class CommentStore {
  comments: Comment[] = [];
  page = 1;
  hasMore = true;

  constructor() {
    makeAutoObservable(this);
  }

  async loadComments() {
    try {
      const initialComments = await fetchItems(this.page);
      this.comments = initialComments;
      this.hasMore = initialComments.length > 0;
    } catch (error) {
      console.error("Error loading initial comments:", error);
    }
  }

  async loadMoreComments() {
    if (!this.hasMore) return;

    try {
      const additionalComments = await fetchItems(this.page + 1);
      const newComments = additionalComments.filter(
        (newComment) =>
          !this.comments.some(
            (existingComment) => existingComment.id === newComment.id
          )
      );

      if (newComments.length > 0) {
        this.page += 1;
        this.comments = [...this.comments, ...newComments];
      } else {
        this.hasMore = false;
      }
    } catch (error) {
      console.error("Error loading additional comments:", error);
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
