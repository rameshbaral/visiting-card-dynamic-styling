import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropCanvas from "../DropCanvas";

describe("DropCanvas Component - Grid Toggle Tests", () => {
  const mockProps = {
    backgroundImage: null,
    droppedFields: [],
    onFieldDrop: jest.fn(),
    onFieldMove: jest.fn(),
    onFieldSelect: jest.fn(),
    selectedField: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders grid by default", () => {
    render(<DropCanvas {...mockProps} />);

    // Check for SVG grid pattern
    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toBeInTheDocument();
  });

  test("shows grid when showGrid is true", () => {
    render(<DropCanvas {...mockProps} showGrid={true} />);

    // Check for SVG grid pattern
    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();

    // Grid should be present (SVG element)
    const gridContainer = canvas?.querySelector("svg");
    expect(gridContainer).toBeInTheDocument();
  });

  test("hides grid when showGrid is false", () => {
    render(<DropCanvas {...mockProps} showGrid={false} />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();

    // Grid should not be present
    const gridContainer = canvas?.querySelector("svg");
    expect(gridContainer).not.toBeInTheDocument();
  });

  test("renders canvas with correct data attribute", () => {
    render(<DropCanvas {...mockProps} />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("data-canvas-export");
  });

  test("renders drop zone message when no fields are present", () => {
    render(<DropCanvas {...mockProps} />);

    expect(
      screen.getByText("Drop fields here to design your card")
    ).toBeInTheDocument();
  });

  test("renders canvas with background image", () => {
    const propsWithBackground = {
      ...mockProps,
      backgroundImage: "/test-background.jpg",
    };

    render(<DropCanvas {...propsWithBackground} />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toHaveStyle({
      backgroundImage: "url(/test-background.jpg)",
    });
  });

  test("renders canvas with correct dimensions", () => {
    render(<DropCanvas {...mockProps} />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toHaveStyle({
      width: "643px",
      height: "383px",
    });
  });

  test("shows canvas size information", () => {
    render(<DropCanvas {...mockProps} />);

    expect(
      screen.getByText("Canvas: 643×383px (Business Card Size)")
    ).toBeInTheDocument();
  });

  test("renders instructions text", () => {
    render(<DropCanvas {...mockProps} />);

    expect(
      screen.getByText(
        /Drag fields from the left sidebar to place them on the canvas/
      )
    ).toBeInTheDocument();
  });

  test("renders dropped fields", () => {
    const propsWithFields = {
      ...mockProps,
      droppedFields: [
        {
          key: "firstName",
          label: "First Name",
          box: { x: 10, y: 10, w: 100, h: 30 },
          style: {
            fontFamily: "Arial",
            fontSize: 16,
            color: "#000000",
          },
          placeholder: "First Name",
        },
      ],
    };

    render(<DropCanvas {...propsWithFields} />);

    expect(screen.getByText("First Name")).toBeInTheDocument();
  });

  test("highlights selected field", () => {
    const propsWithSelectedField = {
      ...mockProps,
      droppedFields: [
        {
          key: "firstName",
          label: "First Name",
          box: { x: 10, y: 10, w: 100, h: 30 },
          style: {
            fontFamily: "Arial",
            fontSize: 16,
            color: "#000000",
          },
          placeholder: "First Name",
        },
      ],
      selectedField: "firstName",
    };

    render(<DropCanvas {...propsWithSelectedField} />);

    const fieldElement = screen.getByText("First Name").closest("div");
    expect(fieldElement).toHaveClass("border-blue-500");
  });
});
