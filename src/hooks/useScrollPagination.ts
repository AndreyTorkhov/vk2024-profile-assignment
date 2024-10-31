import { useEffect } from "react";
import { commentStore } from "../store";

export const useScrollPagination = (
  scrollElementRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    const handleScroll = () => {
      const element = scrollElementRef.current;
      if (
        element &&
        element.scrollHeight - element.scrollTop === element.clientHeight
      ) {
        commentStore.loadMoreComments();
      }
    };
    const element = scrollElementRef.current;
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, [scrollElementRef]);
};
