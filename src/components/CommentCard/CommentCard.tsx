import React from "react";
import { observer } from "mobx-react-lite";
import { Comment } from "../../store/commentStore";
import { DynamicSizeListItem } from "../../types";
import styles from "./CommentCard.module.css";

interface CommentCardProps {
  comment: Comment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  virtualItem: DynamicSizeListItem;
  measureElement: (element: HTMLDivElement | null) => void;
}

const CommentCard: React.FC<CommentCardProps> = observer(
  ({ comment, onEdit, onDelete, virtualItem, measureElement }) => (
    <div
      data-index={virtualItem.index}
      ref={measureElement}
      className={`card mb-3 shadow-sm ${styles.card}`}
      style={{
        transform: `translateY(${virtualItem.offsetTop}px)`,
      }}
    >
      <div className="card-body">
        <h5 className={`card-title ${styles.cardTitle}`}>
          Repository {comment.id}
        </h5>
        <p className={`card-text ${styles.cardText}`}>
          {comment.text || "Данные подгружаются..."}
        </p>
        <button
          className="btn btn-primary btn-sm me-2"
          onClick={() => onEdit(comment.id)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(comment.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
);

export default CommentCard;
