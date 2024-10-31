import { renderHook, act } from "@testing-library/react-hooks";
import { useScrollPagination } from "../hooks/useScrollPagination";
import { commentStore } from "../store";
import { RefObject } from "react";

jest.mock("../store", () => ({
  commentStore: {
    hasMore: true,
    loadMoreComments: jest.fn(),
  },
}));

describe("useScrollPagination", () => {
  let scrollElement: HTMLDivElement;
  let scrollElementRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    jest.clearAllMocks();
    scrollElement = document.createElement("div");
    scrollElementRef = { current: scrollElement };

    Object.defineProperty(scrollElement, "clientHeight", {
      value: 500,
      writable: true,
    });
    Object.defineProperty(scrollElement, "scrollHeight", {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(scrollElement, "scrollTop", {
      value: 0,
      writable: true,
    });
  });

  it("should load more comments when scrolled to the bottom", async () => {
    renderHook(() => useScrollPagination(scrollElementRef));

    (commentStore.hasMore as boolean) = true;
    act(() => {
      Object.defineProperty(scrollElement, "scrollTop", {
        value: 500,
        writable: true,
      });
      scrollElement.dispatchEvent(new Event("scroll"));
    });

    expect(commentStore.loadMoreComments).toHaveBeenCalled();
  });

  it("should not load more comments if there are no more items", () => {
    (commentStore.hasMore as boolean) = false;

    renderHook(() => useScrollPagination(scrollElementRef));

    act(() => {
      Object.defineProperty(scrollElement, "scrollTop", {
        value: 500,
        writable: true,
      });
      scrollElement.dispatchEvent(new Event("scroll"));
    });

    expect(commentStore.loadMoreComments).not.toHaveBeenCalled();
  });

  it("should set isLoading to true while loading comments and then back to false", async () => {
    (commentStore.hasMore as boolean) = true;
    const { waitForNextUpdate } = renderHook(() =>
      useScrollPagination(scrollElementRef)
    );

    act(() => {
      Object.defineProperty(scrollElement, "scrollTop", {
        value: 500,
        writable: true,
      });
      scrollElement.dispatchEvent(new Event("scroll"));
    });

    expect(commentStore.loadMoreComments).toHaveBeenCalled();

    await waitForNextUpdate();

    expect(commentStore.loadMoreComments).toHaveBeenCalledTimes(1);
  });
});
