import { renderHook, act } from "@testing-library/react-hooks";
import { useDynamicSizeList } from "../hooks/useDynamicSizeList";

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("useDynamicSizeList", () => {
  const getItemKey = (index: number) => `item-${index}`;
  let scrollElement: HTMLDivElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    scrollElement = document.createElement("div");

    Object.defineProperty(scrollElement, "clientHeight", {
      value: 500,
      writable: false,
    });
    Object.defineProperty(scrollElement, "scrollHeight", {
      value: 1000,
      writable: false,
    });
    Object.defineProperty(scrollElement, "scrollTop", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const getScrollElement = () => scrollElement;

  it("initializes with default values", () => {
    const { result } = renderHook(() =>
      useDynamicSizeList({
        itemsCount: 10,
        estimateItemHeight: () => 50,
        getItemKey,
        getScrollElement,
      })
    );

    expect(result.current.totalHeight).toBeGreaterThan(0);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBeGreaterThan(0);
    expect(result.current.isScrolling).toBe(false);
  });

  it("calculates virtual items correctly", () => {
    const { result } = renderHook(() =>
      useDynamicSizeList({
        itemsCount: 20,
        estimateItemHeight: () => 100,
        getItemKey,
        getScrollElement,
      })
    );

    expect(result.current.virtualItems.length).toBeGreaterThan(0);
    expect(result.current.totalHeight).toBe(2000);
  });

  it("updates scroll position and triggers isScrolling", () => {
    const { result } = renderHook(() =>
      useDynamicSizeList({
        itemsCount: 10,
        estimateItemHeight: () => 50,
        getItemKey,
        getScrollElement,
        scrollingDelay: 10,
      })
    );

    act(() => {
      Object.defineProperty(scrollElement, "scrollTop", {
        value: 200,
        writable: true,
      });
      scrollElement.dispatchEvent(new Event("scroll"));
      result.current.measureElement(null);
    });

    expect(result.current.isScrolling).toBe(true);

    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(result.current.isScrolling).toBe(false);
  });

  it("observes and updates list height with ResizeObserver", () => {
    const resizeObserverMock = jest.fn();
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: resizeObserverMock,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    const { result } = renderHook(() =>
      useDynamicSizeList({
        itemsCount: 10,
        estimateItemHeight: () => 50,
        getItemKey,
        getScrollElement,
      })
    );

    expect(resizeObserverMock).toHaveBeenCalledWith(scrollElement);
  });
});
