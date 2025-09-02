import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CanvasDesigner from "../CanvasDesigner";
import * as downloadUtils from "../../../utils/download";

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

describe("CanvasDesigner Export Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders export buttons", () => {
    render(<CanvasDesigner />);

    expect(screen.getByTitle("Export canvas as PNG image")).toBeInTheDocument();
    expect(screen.getByTitle("Export canvas as PDF")).toBeInTheDocument();
    expect(
      screen.getByTitle("Export template configuration as JSON")
    ).toBeInTheDocument();
  });

  test("export buttons are disabled when no fields are dropped", () => {
    render(<CanvasDesigner />);

    const pngButton = screen.getByTitle("Export canvas as PNG image");
    const pdfButton = screen.getByTitle("Export canvas as PDF");

    expect(pngButton).toBeDisabled();
    expect(pdfButton).toBeDisabled();
  });

  test("PNG export works after dropping a field", async () => {
    render(<CanvasDesigner />);

    // Simulate dropping a field on the canvas
    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();

    // Mock drag and drop by directly calling the drop handler
    const dragEvent = new DragEvent("drop", {
      dataTransfer: new DataTransfer(),
    });

    // Set up the drag data
    const fieldData = {
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
    };

    dragEvent.dataTransfer?.setData("text/plain", JSON.stringify(fieldData));

    // Simulate the drop event on canvas
    if (canvas) {
      // Mock getBoundingClientRect for positioning
      jest.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: 643,
        bottom: 383,
        width: 643,
        height: 383,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.dragOver(canvas, dragEvent);
      fireEvent.drop(canvas, dragEvent);
    }

    // Wait for the field to be added
    await waitFor(() => {
      expect(screen.getByText("First Name")).toBeInTheDocument();
    });

    // Now the export buttons should be enabled
    const pngButton = screen.getByTitle("Export canvas as PNG image");
    expect(pngButton).not.toBeDisabled();

    // Click the PNG export button
    fireEvent.click(pngButton);

    // Verify the download function was called
    await waitFor(() => {
      expect(downloadUtils.downloadAsPNG).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        "template-preview.png"
      );
    });
  });

  test("PDF export works after dropping a field", async () => {
    render(<CanvasDesigner />);

    // Set template name first
    const templateInput = screen.getByPlaceholderText("Template Name");
    fireEvent.change(templateInput, { target: { value: "Test Template" } });

    // Simulate dropping a field on the canvas
    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");

    if (canvas) {
      const dragEvent = new DragEvent("drop", {
        dataTransfer: new DataTransfer(),
      });

      const fieldData = {
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
      };

      dragEvent.dataTransfer?.setData("text/plain", JSON.stringify(fieldData));

      // Mock getBoundingClientRect for positioning
      jest.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: 643,
        bottom: 383,
        width: 643,
        height: 383,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.dragOver(canvas, dragEvent);
      fireEvent.drop(canvas, dragEvent);
    }

    // Wait for the field to be added
    await waitFor(() => {
      expect(screen.getByText("Last Name")).toBeInTheDocument();
    });

    // Click the PDF export button
    const pdfButton = screen.getByTitle("Export canvas as PDF");
    expect(pdfButton).not.toBeDisabled();

    fireEvent.click(pdfButton);

    // Verify the download function was called with the template name
    await waitFor(() => {
      expect(downloadUtils.downloadAsPDF).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        "testtemplate-preview.pdf"
      );
    });
  });

  test("canvas has correct export data attribute", () => {
    render(<CanvasDesigner />);

    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("data-canvas-export");
  });

  test("export functions handle missing canvas gracefully", async () => {
    render(<CanvasDesigner />);

    // Mock querySelector to return null (simulating missing canvas)
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn().mockReturnValue(null);

    // Simulate having fields to enable export buttons
    const canvas = screen
      .getByText("Drop fields here to design your card")
      .closest("[data-canvas-export]");

    if (canvas) {
      const dragEvent = new DragEvent("drop", {
        dataTransfer: new DataTransfer(),
      });

      const fieldData = {
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
      };

      dragEvent.dataTransfer?.setData("text/plain", JSON.stringify(fieldData));

      jest.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: 643,
        bottom: 383,
        width: 643,
        height: 383,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.dragOver(canvas, dragEvent);
      fireEvent.drop(canvas, dragEvent);
    }

    await waitFor(() => {
      expect(screen.getByText("First Name")).toBeInTheDocument();
    });

    // Try to export - should not crash
    const pngButton = screen.getByTitle("Export canvas as PNG image");
    fireEvent.click(pngButton);

    // Should not call download functions since canvas is not found
    expect(downloadUtils.downloadAsPNG).not.toHaveBeenCalled();

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });
});
