import { render, screen, fireEvent } from "@testing-library/react";
import CommentCard from "../components/CommentCard/CommentCard";
import { Comment } from "../store/commentStore";

describe("CommentCard", () => {
  const comment: Comment = { id: 1, text: "Test Comment" };
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const measureElement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the comment text", () => {
    render(
      <CommentCard
        comment={comment}
        onEdit={onEdit}
        onDelete={onDelete}
        virtualItem={{
          index: 0,
          offsetTop: 0,
          key: "unique-key",
          height: 50,
        }}
        measureElement={measureElement}
      />
    );

    expect(screen.getByText("Test Comment")).toBeInTheDocument();
  });

  it("calls onEdit when the Edit button is clicked", () => {
    render(
      <CommentCard
        comment={comment}
        onEdit={onEdit}
        onDelete={onDelete}
        virtualItem={{
          index: 0,
          offsetTop: 0,
          key: "unique-key",
          height: 50,
        }}
        measureElement={measureElement}
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(comment.id);
  });

  it("calls onDelete when the Delete button is clicked", () => {
    render(
      <CommentCard
        comment={comment}
        onEdit={onEdit}
        onDelete={onDelete}
        virtualItem={{
          index: 0,
          offsetTop: 0,
          key: "unique-key",
          height: 50,
        }}
        measureElement={measureElement}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(comment.id);
  });

  it("calls measureElement with the element ref", () => {
    render(
      <CommentCard
        comment={comment}
        onEdit={onEdit}
        onDelete={onDelete}
        virtualItem={{
          index: 0,
          offsetTop: 0,
          key: "unique-key",
          height: 50,
        }}
        measureElement={measureElement}
      />
    );

    expect(measureElement).toHaveBeenCalled();
    expect(measureElement.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it("displays the comment ID in the title", () => {
    render(
      <CommentCard
        comment={{ id: 123, text: "Sample Text" }}
        onEdit={onEdit}
        onDelete={onDelete}
        virtualItem={{
          index: 0,
          offsetTop: 0,
          key: "unique-key",
          height: 50,
        }}
        measureElement={measureElement}
      />
    );

    expect(screen.getByText("Repository 123")).toBeInTheDocument();
  });
});
