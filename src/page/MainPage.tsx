import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { commentStore } from "../store";
import CommentsList from "../components/CommentsList";

export const DynamicHeight = observer(() => {
  useEffect(() => {
    commentStore.loadComments();
  }, []);

  return (
    <div className="container mt-4">
      <CommentsList />
    </div>
  );
});
