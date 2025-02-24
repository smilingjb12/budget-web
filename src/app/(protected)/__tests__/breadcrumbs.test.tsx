/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "../breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders children correctly", () => {
    render(<BreadcrumbItem>Home</BreadcrumbItem>);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("applies muted text color when not active", () => {
    render(<BreadcrumbItem>Home</BreadcrumbItem>);
    const element = screen.getByText("Home");
    expect(element).toHaveClass("text-muted-foreground");
    expect(element).not.toHaveClass("font-semibold");
  });

  it("applies semibold font when active", () => {
    render(<BreadcrumbItem isActive>Home</BreadcrumbItem>);
    const element = screen.getByText("Home");
    expect(element).toHaveClass("font-semibold");
    expect(element).not.toHaveClass("text-muted-foreground");
  });

  it("renders a complete breadcrumb trail", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Category</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem isActive>Current Page</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();

    // Check for correct styling
    expect(screen.getByText("Home")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Category")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Current Page")).toHaveClass("font-semibold");

    // Check for separators (SVGs)
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });
});
