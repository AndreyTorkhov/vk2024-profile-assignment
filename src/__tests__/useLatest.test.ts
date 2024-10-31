import { renderHook } from "@testing-library/react-hooks";
import { useLatest } from "../hooks/useLatest";

describe("useLatest", () => {
  it("should return the latest value", () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: "initial value" },
    });

    expect(result.current.current).toBe("initial value");

    rerender({ value: "updated value" });
    expect(result.current.current).toBe("updated value");

    rerender({ value: "final value" });
    expect(result.current.current).toBe("final value");
  });
});
