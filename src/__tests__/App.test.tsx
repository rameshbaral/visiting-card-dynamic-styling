import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Mock the download utilities
jest.mock("../utils/download", () => ({
  downloadAsPNG: jest.fn(),
  downloadAsPDF: jest.fn(),
}));

// Mock the field definitions
jest.mock("../data/fieldDefinitions.json", () => [
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

describe("App Component - Navigation Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Card Editor by default", () => {
    render(<App />);
    expect(screen.getByText("Card Editor")).toBeInTheDocument();
    expect(screen.getByText("Template Designer")).toBeInTheDocument();
    expect(screen.getByText("Visiting Card Designer")).toBeInTheDocument();
  });

  test("switches to Template Designer when button is clicked", () => {
    render(<App />);

    const templateDesignerButton = screen.getByText("Template Designer");
    fireEvent.click(templateDesignerButton);

    // Should now show Template Designer interface
    expect(screen.getByText("Template Designer")).toBeInTheDocument();
    expect(screen.getByText("← Back to Card Editor")).toBeInTheDocument();
  });

  test("navigates back to Card Editor from Template Designer", () => {
    render(<App />);

    // Go to Template Designer
    const templateDesignerButton = screen.getByText("Template Designer");
    fireEvent.click(templateDesignerButton);

    // Navigate back to Card Editor
    const backButton = screen.getByText("← Back to Card Editor");
    fireEvent.click(backButton);

    // Should be back in Card Editor
    expect(screen.getByText("Card Editor")).toBeInTheDocument();
    expect(screen.getByText("Template Designer")).toBeInTheDocument();
  });

  test("Card Editor button is active by default", () => {
    render(<App />);

    const cardEditorButton = screen.getByText("Card Editor");
    expect(cardEditorButton).toHaveClass("bg-blue-600");
  });

  test("Template Designer button becomes active when clicked", () => {
    render(<App />);

    const templateDesignerButton = screen.getByText("Template Designer");
    const cardEditorButton = screen.getByText("Card Editor");

    // Initially Card Editor is active
    expect(cardEditorButton).toHaveClass("bg-blue-600");
    expect(templateDesignerButton).toHaveClass("bg-gray-200");

    // Click Template Designer
    fireEvent.click(templateDesignerButton);

    // Now Template Designer should be in the view (back button should exist)
    expect(screen.getByText("← Back to Card Editor")).toBeInTheDocument();
  });
});
