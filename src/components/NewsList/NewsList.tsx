// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// // import NewsItem from "./NewsItem";
// import { fetchNews } from "../../api/gdeltApi";
// import { NewsItemType } from "../../types";
// // import styles from "../../styles/NewsList.module.css";

// type Key = string | number;

// interface UseDynamicSizeListProps {
//   loading?: boolean;
//   itemsCount: number;
//   itemHeight?: (index: number) => number;
//   estimateItemHeight?: (index: number) => number;
//   getItemKey: (index: number) => Key;
//   overscan?: number;
//   scrollingDelay?: number;
//   getScrollElement: () => HTMLElement | null;
// }

// interface DynamicSizeListItem {
//   key: Key;
//   index: number;
//   offsetTop: number;
//   height: number;
// }

// const DEFAULT_OVERSCAN = 3;
// const DEFAULT_SCROLLING_DELAY = 150;

// function validateProps(props: UseDynamicSizeListProps) {
//   const { itemHeight, estimateItemHeight } = props;

//   if (!itemHeight && !estimateItemHeight) {
//     throw new Error(
//       `you must pass either "itemHeight" or "estimateItemHeight" prop`
//     );
//   }
// }

// function useDynamicSizeList(props: UseDynamicSizeListProps) {
//   validateProps(props);
//   const {
//     loading,
//     itemHeight,
//     estimateItemHeight,
//     getItemKey,
//     itemsCount,
//     scrollingDelay = DEFAULT_SCROLLING_DELAY,
//     overscan = DEFAULT_OVERSCAN,
//     // listHeight,
//     getScrollElement,
//   } = props;

//   const [measurementCache, setMeasurementCache] = useState<Record<Key, number>>(
//     {}
//   );

//   const [listHeight, setListHeight] = useState(0);
//   const [scrollTop, setScrollTop] = useState(0);
//   const [isScrolling, setIsScrolling] = useState(false);

//   useLayoutEffect(() => {
//     if (loading) return;
//     const scrollElement = getScrollElement();

//     if (!scrollElement) {
//       return;
//     }

//     const resizeObserver = new ResizeObserver(([entry]) => {
//       if (!entry) {
//         return;
//       }
//       const height =
//         entry.borderBoxSize[0]?.blockSize ??
//         entry.target.getBoundingClientRect().height;

//       setListHeight(height);
//     });

//     resizeObserver.observe(scrollElement);

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [getScrollElement, loading]);

//   useLayoutEffect(() => {
//     if (loading) return;
//     const scrollElement = getScrollElement();

//     if (!scrollElement) {
//       return;
//     }

//     const handleScroll = () => {
//       const scrollTop = scrollElement.scrollTop;

//       setScrollTop(scrollTop);
//     };

//     handleScroll();

//     scrollElement.addEventListener("scroll", handleScroll);

//     return () => scrollElement.removeEventListener("scroll", handleScroll);
//   }, [getScrollElement, loading]);

//   useEffect(() => {
//     if (loading) return;
//     const scrollElement = getScrollElement();

//     if (!scrollElement) {
//       return;
//     }

//     let timeoutId: number | null = null;

//     const handleScroll = () => {
//       setIsScrolling(true);

//       if (typeof timeoutId === "number") {
//         clearTimeout(timeoutId);
//       }

//       timeoutId = setTimeout(() => {
//         setIsScrolling(false);
//       }, scrollingDelay);
//     };

//     scrollElement.addEventListener("scroll", handleScroll);

//     return () => {
//       if (typeof timeoutId === "number") {
//         clearTimeout(timeoutId);
//       }
//       scrollElement.removeEventListener("scroll", handleScroll);
//     };
//   }, [getScrollElement, loading, scrollingDelay]);

//   const { virtualItems, startIndex, endIndex, totalHeight, allItems } =
//     useMemo(() => {
//       const getItemHeight = (index: number) => {
//         if (itemHeight) {
//           return itemHeight(index);
//         }

//         const key = getItemKey(index);
//         if (typeof measurementCache[key] === "number") {
//           return measurementCache[key]!;
//         }

//         return estimateItemHeight!(index);
//       };

//       const rangeStart = scrollTop;
//       const rangeEnd = scrollTop + listHeight;

//       let totalHeight = 0;
//       let startIndex = -1;
//       let endIndex = -1;
//       const allRows: DynamicSizeListItem[] = Array(itemsCount);

//       for (let index = 0; index < itemsCount; index++) {
//         const key = getItemKey(index);
//         const row = {
//           key,
//           index: index,
//           height: getItemHeight(index),
//           offsetTop: totalHeight,
//         };

//         totalHeight += row.height;
//         allRows[index] = row;

//         if (startIndex === -1 && row.offsetTop + row.height > rangeStart) {
//           startIndex = Math.max(0, index - overscan);
//         }

//         if (endIndex === -1 && row.offsetTop + row.height >= rangeEnd) {
//           endIndex = Math.min(itemsCount - 1, index + overscan);
//         }
//       }

//       const virtualRows = allRows.slice(startIndex, endIndex + 1);

//       return {
//         virtualItems: virtualRows,
//         startIndex,
//         endIndex,
//         allItems: allRows,
//         totalHeight,
//       };
//     }, [
//       scrollTop,
//       overscan,
//       listHeight,
//       itemHeight,
//       getItemKey,
//       estimateItemHeight,
//       measurementCache,
//       itemsCount,
//     ]);

//   const measureElement = useCallback(
//     (element: Element | null) => {
//       if (!element) {
//         return;
//       }

//       const indexAttribute = element.getAttribute("data-index") || "";
//       const index = parseInt(indexAttribute, 10);

//       if (Number.isNaN(index)) {
//         console.error(
//           "dynamic elements must have a valid `data-index` attribute"
//         );
//         return;
//       }

//       const size = element.getBoundingClientRect();
//       const key = getItemKey(index);

//       setMeasurementCache((cache) => ({ ...cache, [key]: size.height }));
//     },
//     [getItemKey]
//   );

//   return {
//     virtualItems,
//     totalHeight,
//     startIndex,
//     endIndex,
//     isScrolling,
//     allItems,
//     measureElement,
//   };
// }

// const containerHeight = 600;

// const NewsList = () => {
//   const [news, setNews] = useState<NewsItemType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const scrollElementRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const loadNews = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchNews();
//         // Добавляем уникальный идентификатор на основе index
//         const newsWithId = data.articles.map((article: NewsItemType) => ({
//           ...article,
//           id: Math.random().toString(36).slice(2), // Используем комбинацию domain и индекса
//         }));
//         setNews(newsWithId);
//       } catch (error) {
//         console.error("Failed to load news:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadNews();
//   }, []);

//   const { virtualItems, totalHeight, measureElement } = useDynamicSizeList({
//     estimateItemHeight: useCallback(() => 16, []),
//     itemsCount: news.length,
//     getScrollElement: useCallback(() => scrollElementRef.current, []),
//     getItemKey: useCallback((index) => news[index]!.id, [news]), // Используем индекс как ключ
//   });

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div
//       ref={scrollElementRef}
//       style={{
//         height: containerHeight,
//         overflow: "auto",
//         border: "1px solid lightgrey",
//         position: "relative",
//       }}
//     >
//       <div
//         style={{
//           height: totalHeight,
//         }}
//       >
//         {virtualItems.map((virtualItem) => {
//           const item = news[virtualItem.index]!;

//           return (
//             <div
//               data-index={virtualItem.index}
//               ref={measureElement}
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 transform: `translateY(${virtualItem.offsetTop}px)`,
//                 padding: "6px 12px",
//               }}
//               key={virtualItem.index} // Теперь используем индекс как ключ
//             >
//               {virtualItem.index}.
//               <span>
//                 Источник: {item.domain}, {item.sourcecountry}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default NewsList;
