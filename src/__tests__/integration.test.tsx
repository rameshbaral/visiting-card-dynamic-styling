import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  {
    key: "lastName",
    label: "Last Name",
    placeholder: "Last Name",
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

describe("Integration Tests - Complete Workflow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Complete workflow: Navigation → Template Design → Export → Import", async () => {
    render(<App />);

    // Step 1: Start in Card Editor
    expect(screen.getByText("Visiting Card Designer")).toBeInTheDocument();
    expect(screen.getByText("Card Editor")).toBeInTheDocument();

    // Step 2: Navigate to Template Designer
    const templateDesignerButton = screen.getByText("Template Designer");
    fireEvent.click(templateDesignerButton);

    // Verify we're in Template Designer
    expect(screen.getByText("Template Designer")).toBeInTheDocument();
    expect(screen.getByText("← Back to Card Editor")).toBeInTheDocument();

    // Step 3: Test Grid Toggle
    expect(screen.getByText("Hide Grid")).toBeInTheDocument();

    const gridButton = screen.getByText("Hide Grid");
    fireEvent.click(gridButton);
    expect(screen.getByText("Show Grid")).toBeInTheDocument();

    // Toggle back
    fireEvent.click(screen.getByText("Show Grid"));
    expect(screen.getByText("Hide Grid")).toBeInTheDocument();

    // Step 4: Add Template Name
    const templateNameInput = screen.getByPlaceholderText("Template Name");
    fireEvent.change(templateNameInput, {
      target: { value: "Test Integration Template" },
    });

    // Step 5: Verify Export buttons are disabled (no fields)
    const pngButton = screen.getByTitle("Export canvas as PNG image");
    const pdfButton = screen.getByTitle("Export canvas as PDF");
    const templateButton = screen.getByTitle(
      "Export template configuration as JSON"
    );

    expect(pngButton).toBeDisabled();
    expect(pdfButton).toBeDisabled();
    expect(templateButton).not.toBeDisabled(); // Should be enabled with template name

    // Step 6: Navigate back to Card Editor
    const backButton = screen.getByText("← Back to Card Editor");
    fireEvent.click(backButton);

    // Verify we're back in Card Editor
    expect(screen.getByText("Card Editor")).toBeInTheDocument();
    expect(screen.getByText("Template Designer")).toBeInTheDocument();
  });

  test("Template import workflow", async () => {
    render(<App />);

    // Should see import button in Templates section
    expect(screen.getByText("Import Template")).toBeInTheDocument();

    // Verify file input exists and accepts JSON
    const importButton = screen.getByText("Import Template");
    const fileInput =
      importButton.parentElement?.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute("accept", ".json");
  });

  test("Grid toggle persists state", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Toggle grid off
    const gridButton = screen.getByText("Hide Grid");
    fireEvent.click(gridButton);
    expect(screen.getByText("Show Grid")).toBeInTheDocument();

    // Navigate back and forth
    fireEvent.click(screen.getByText("← Back to Card Editor"));
    fireEvent.click(screen.getByText("Template Designer"));

    // Grid should still be hidden (state persisted)
    expect(screen.getByText("Show Grid")).toBeInTheDocument();
  });

  test("Canvas has proper export attributes", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Check canvas has export attribute
    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("data-canvas-export");
  });

  test("Template name affects export filename", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Set template name
    const templateNameInput = screen.getByPlaceholderText("Template Name");
    fireEvent.change(templateNameInput, {
      target: { value: "My Custom Template" },
    });

    // Template export button should be enabled
    const templateButton = screen.getByTitle(
      "Export template configuration as JSON"
    );
    expect(templateButton).not.toBeDisabled();
  });

  test("Clear canvas functionality", () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Click clear canvas
    const clearButton = screen.getByText("Clear Canvas");
    fireEvent.click(clearButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to clear the canvas? This action cannot be undone."
    );
  });

  test("Background selector integration", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Should see background selector
    expect(screen.getByText("Background")).toBeInTheDocument();
  });

  test("Field sidebar integration", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Should see available fields
    expect(screen.getByText("Available Fields")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
  });

  test("Instructions are displayed", () => {
    render(<App />);

    // Navigate to Template Designer
    fireEvent.click(screen.getByText("Template Designer"));

    // Should see instructions
    expect(screen.getByText("Instructions:")).toBeInTheDocument();
    expect(
      screen.getByText(/Drag fields from the left sidebar/)
    ).toBeInTheDocument();
  });
});
