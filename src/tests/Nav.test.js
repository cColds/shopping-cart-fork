import Nav from "../components/Nav";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("nav", () => {
  it("should navigate to href properly", async () => {
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "href",
      "/shop"
    );
  });

  it("should display amount in cart", () => {
    render(
      <BrowserRouter>
        <Nav cartAmount={27} />
      </BrowserRouter>
    );

    expect(screen.getByText(27)).toBeInTheDocument();
  });

  it("does not show amount in cart if is 0", () => {
    render(
      <BrowserRouter>
        <Nav cartAmount={0} />
      </BrowserRouter>
    );

    expect(screen.queryByText(0)).not.toBeInTheDocument();
  });
});
