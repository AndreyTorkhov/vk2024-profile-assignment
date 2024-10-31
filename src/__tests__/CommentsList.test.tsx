import { render, screen, fireEvent } from "@testing-library/react";
import { commentStore } from "../store";
import CommentsList from "../components/CommentsList/CommentsList";

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock("../store", () => ({
  commentStore: {
    comments: [
      { id: 1, text: "Comment 1" },
      { id: 2, text: "Comment 2" },
      { id: 3, text: "Comment 3" },
    ],
    loadMoreComments: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
  },
}));

describe("CommentsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls updateComment on edit", () => {
    jest.spyOn(window, "prompt").mockReturnValue("Updated Comment");

    render(<CommentsList />);
    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(commentStore.updateComment).toHaveBeenCalledWith(
      3,
      "Updated Comment"
    );
  });

  it("calls deleteComment on delete", () => {
    render(<CommentsList />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(commentStore.deleteComment).toHaveBeenCalledWith(3);
  });
});
