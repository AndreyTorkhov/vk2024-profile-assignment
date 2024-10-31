import { useCallback, useRef } from "react";
import { commentStore } from "../../store";
import { observer } from "mobx-react-lite";
import { useDynamicSizeList } from "../../hooks/useDynamicSizeList";
import { useScrollPagination } from "../../hooks/useScrollPagination";
import styles from "./CommentsList.module.css";
import CommentCard from "../CommentCard";

const CommentsList = observer(() => {
  const scrollElementRef = useRef<HTMLDivElement>(null);

  useScrollPagination(scrollElementRef);

  const { virtualItems, totalHeight, measureElement } = useDynamicSizeList({
    estimateItemHeight: useCallback(() => 100, []),
    itemsCount: commentStore.comments.length,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
    getItemKey: useCallback(
      (index) => commentStore.comments[index]?.id ?? index,
      [commentStore.comments]
    ),
  });

  const handleEdit = (id: number) => {
    const newText = prompt("Введите новый текст:");
    if (newText) commentStore.updateComment(id, newText);
  };

  const handleDelete = (id: number) => {
    commentStore.deleteComment(id);
  };

  return (
    <div ref={scrollElementRef} className={styles.scrollContainer}>
      <div style={{ height: totalHeight, position: "relative" }}>
        {virtualItems.map((virtualItem, index) => {
          const item = commentStore.comments[virtualItem.index];
          return (
            <CommentCard
              comment={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              key={`${item?.id}-${index}`}
              virtualItem={virtualItem}
              measureElement={measureElement}
            />
          );
        })}
      </div>
    </div>
  );
});

export default CommentsList;
