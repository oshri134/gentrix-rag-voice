import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading indicator when isLoading", () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText("⏳")).toBeInTheDocument();
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: "#4CAF50" });
  });

  it("applies danger variant styles", () => {
    render(<Button variant="danger">Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: "#f44336" });
  });
});
