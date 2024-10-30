import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import NewsItem from "./NewsItem";
import { fetchNews } from "../../api/gdeltApi";
import { NewsItemType } from "../../types";
// import styles from "../../styles/NewsList.module.css";

interface UseFixedSizeListProps {
  loading: boolean;
  itemsCount: number;
  itemHeight: number;
  listHeight: number;
  overscan?: number;
  scrollingDelay?: number;
  getScrollElement: () => HTMLElement | null;
}

const DEFAULT_OVERSCAN = 3;
const DEFAULT_SCROLLING_DELAY = 150;

function useFixedSizeList(props: UseFixedSizeListProps) {
  const {
    loading,
    itemHeight,
    itemsCount,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    overscan = DEFAULT_OVERSCAN,
    listHeight,
    getScrollElement,
  } = props;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useLayoutEffect(() => {
    if (loading) return;
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;

      setScrollTop(scrollTop);
    };

    handleScroll();

    scrollElement.addEventListener("scroll", handleScroll);

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [getScrollElement, loading]);

  useEffect(() => {
    if (loading) return;
    const scrollElement = getScrollElement();

    if (!scrollElement) {
      return;
    }

    let timeoutId: number | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
      }
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [getScrollElement, loading, scrollingDelay]);

  const { virtualItems, startIndex, endIndex } = useMemo(() => {
    const rangeStart = scrollTop;
    const rangeEnd = scrollTop + listHeight;

    let startIndex = Math.floor(rangeStart / itemHeight);
    let endIndex = Math.ceil(rangeEnd / itemHeight);

    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(itemsCount - 1, endIndex + overscan);

    const virtualItems = [];

    for (let index = startIndex; index <= endIndex; index++) {
      virtualItems.push({
        index,
        offsetTop: index * itemHeight,
      });
    }
    return { virtualItems, startIndex, endIndex };
  }, [scrollTop, listHeight, itemsCount]);

  const totalHeight = itemHeight * itemsCount;

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    isScrolling,
  };
}

const itemHeight = 50;
const containerHeight = 600;

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const scrollElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error("Failed to load news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const { isScrolling, virtualItems, totalHeight } = useFixedSizeList({
    loading: loading,
    itemHeight: itemHeight,
    itemsCount: news.length,
    listHeight: containerHeight,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div
      ref={scrollElementRef}
      style={{
        height: containerHeight,
        overflow: "auto",
        border: "1px solid lightgrey",
        position: "relative",
      }}
    >
      <div
        style={{
          height: totalHeight,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = news[virtualItem.index]!;
          return (
            <div
              style={{
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualItem.offsetTop}px)`,
                height: itemHeight,
                padding: "6px 12px",
              }}
              key={virtualItem.index}
            >
              {isScrolling ? (
                "Scrolling"
              ) : (
                <>
                  {virtualItem.index}.
                  <span>
                    Источник: {item.domain}, {item.sourcecountry}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsList;
