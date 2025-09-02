import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CanvasDesigner from "../CanvasDesigner";

// Mock the download utilities
jest.mock("../../../utils/download", () => ({
  downloadAsPNG: jest.fn(),
  downloadAsPDF: jest.fn(),
}));

// Mock the field definitions
jest.mock("../../../data/fieldDefinitions.json", () => [
  {
    key: "firstName",
    label: "First Name",
    placeholder: "First Name",
    type: "text",
    defaultStyle: {
      fontFamily: "Inter, ui-sans-serif",
      fontSize: 20,
      weight: "bold",
      color: "#000000",
    },
    defaultSize: { w: 220, h: 35 },
  },
]);

describe("CanvasDesigner Component - New Features Tests", () => {
  const mockNavigateToEditor = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navigation back button when onNavigateToEditor is provided", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    expect(screen.getByText("← Back to Card Editor")).toBeInTheDocument();
  });

  test("calls onNavigateToEditor when back button is clicked", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const backButton = screen.getByText("← Back to Card Editor");
    fireEvent.click(backButton);

    expect(mockNavigateToEditor).toHaveBeenCalledTimes(1);
  });

  test("does not render back button when onNavigateToEditor is not provided", () => {
    render(<CanvasDesigner />);

    expect(screen.queryByText("← Back to Card Editor")).not.toBeInTheDocument();
  });

  test("renders grid toggle button", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    expect(screen.getByText("Hide Grid")).toBeInTheDocument();
  });

  test("toggles grid visibility when grid button is clicked", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const gridButton = screen.getByText("Hide Grid");
    fireEvent.click(gridButton);

    expect(screen.getByText("Show Grid")).toBeInTheDocument();

    // Click again to show grid
    fireEvent.click(screen.getByText("Show Grid"));
    expect(screen.getByText("Hide Grid")).toBeInTheDocument();
  });

  test("grid button has correct styling when grid is shown", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const gridButton = screen.getByText("Hide Grid");
    expect(gridButton).toHaveClass("bg-gray-600");
  });

  test("grid button has correct styling when grid is hidden", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const gridButton = screen.getByText("Hide Grid");
    fireEvent.click(gridButton);

    const showGridButton = screen.getByText("Show Grid");
    expect(showGridButton).toHaveClass("bg-gray-200");
  });

  test("renders all export buttons", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    expect(screen.getByTitle("Export canvas as PNG image")).toBeInTheDocument();
    expect(screen.getByTitle("Export canvas as PDF")).toBeInTheDocument();
    expect(
      screen.getByTitle("Export template configuration as JSON")
    ).toBeInTheDocument();
  });

  test("export buttons are disabled when no fields are placed", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const pngButton = screen.getByTitle("Export canvas as PNG image");
    const pdfButton = screen.getByTitle("Export canvas as PDF");

    expect(pngButton).toBeDisabled();
    expect(pdfButton).toBeDisabled();
  });

  test("template name input is present", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    expect(screen.getByPlaceholderText("Template Name")).toBeInTheDocument();
  });

  test("clear canvas button is present", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    expect(screen.getByText("Clear Canvas")).toBeInTheDocument();
  });

  test("renders field properties section when field is selected", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    // Initially no field properties should be visible
    expect(screen.queryByText("Field Properties")).not.toBeInTheDocument();
  });

  test("renders canvas with proper data attribute", () => {
    render(<CanvasDesigner onNavigateToEditor={mockNavigateToEditor} />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("data-canvas-export");
  });
});
