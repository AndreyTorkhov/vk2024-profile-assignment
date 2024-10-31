import { useEffect, useState } from "react";
import { commentStore } from "../store";

export const useScrollPagination = (
  scrollElementRef: React.RefObject<HTMLDivElement>
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      const element = scrollElementRef.current;
      if (!commentStore.hasMore) return;

      if (
        element &&
        element.scrollHeight - element.scrollTop <= element.clientHeight + 5 &&
        !isLoading
      ) {
        setIsLoading(true);
        await commentStore.loadMoreComments();
        setIsLoading(false);
      }
    };

    const element = scrollElementRef.current;
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, [scrollElementRef, isLoading]);

  return { isLoading };
};
