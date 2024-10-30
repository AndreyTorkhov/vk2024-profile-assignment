import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
// import NewsItem from "./NewsItem";
import { fetchNews } from "../../api/gdeltApi";
import { NewsItemType } from "../../types";
import styles from "../../styles/NewsList.module.css";

const itemHeight = 50;
const containerHeight = 600;
const overscan = 3;
const DEFAULT_SCROLLING_DELAY = 150;

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

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

  useLayoutEffect(() => {
    if (loading) return;
    const scrollElement = scrollElementRef.current;

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
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const scrollElement = scrollElementRef.current;

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
      }, DEFAULT_SCROLLING_DELAY);
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      if (typeof timeoutId === "number") {
        clearTimeout(timeoutId);
      }
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const virtualItems = useMemo(() => {
    const rangeStart = scrollTop;
    const rangeEnd = scrollTop + containerHeight;

    let startIndex = Math.floor(rangeStart / itemHeight);
    let endIndex = Math.ceil(rangeEnd / itemHeight);

    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(news.length - 1, endIndex + overscan);

    const virtualItems = [];
    for (let index = startIndex; index <= endIndex; index++) {
      virtualItems.push({
        index,
        offsetTop: index * itemHeight,
      });
    }

    return virtualItems;
  }, [scrollTop, news.length]);

  //   const itemsToRender = news.slice(startIndex, endIndex + 1);
  const totalListHight = itemHeight * news.length;

  if (loading) return <p>Loading...</p>;

  return (
    <div
      ref={scrollElementRef}
      className={styles.newsList}
      style={{
        height: containerHeight,
        overflow: "auto",
        border: "1px solid red",
        position: "relative",
      }}
    >
      <div
        style={{
          height: totalListHight,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = news[virtualItem.index]!;
          return (
            // <NewsItem
            //   key={virtualItem.index}
            //   news={item}
            //   index={virtualItem.index}
            // />
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
