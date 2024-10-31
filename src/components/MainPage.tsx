import { useCallback, useEffect, useRef, useState } from "react";
import { fetchItems } from "../api/gdeltApi";
import { useDynamicSizeList } from "../hooks/useDynamicSizeList";

const containerHeight = 650;

interface ListItem {
  id: number;
  text: string;
}

export function DynamicHeight() {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const loadItems = async () => {
      const newItems = await fetchItems(page, 50);
      setListItems(newItems);
    };
    loadItems();
  }, [page]);

  const handleScroll = () => {
    const element = scrollElementRef.current;
    if (element) {
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const element = scrollElementRef.current;
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, []);

  const { virtualItems, totalHeight, measureElement } = useDynamicSizeList({
    estimateItemHeight: useCallback(() => 100, []),
    itemsCount: listItems.length,
    getScrollElement: useCallback(() => scrollElementRef.current, []),
    getItemKey: useCallback(
      (index) => listItems[index]?.id ?? index,
      [listItems]
    ),
  });

  return (
    <div style={{ padding: "20px" }}>
      <div
        ref={scrollElementRef}
        style={{
          height: containerHeight,
          overflow: "auto",
          border: "1px solid lightgrey",
          position: "relative",
        }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {virtualItems.map((virtualItem, index) => {
            const item = listItems[virtualItem.index];
            return (
              <div
                key={`${item?.id}-${index}`}
                data-index={virtualItem.index}
                ref={measureElement}
                className="card mb-3 shadow-sm"
                style={{
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  transform: `translateY(${virtualItem.offsetTop}px)`,
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">Comment {item?.id}</h5>
                  <p className="card-text">{item?.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
