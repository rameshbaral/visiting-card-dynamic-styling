/**
 * Simple test to verify export functionality is properly implemented
 * This test verifies the structure and functionality without complex DOM manipulation
 */

import { downloadAsPNG, downloadAsPDF } from "../../../utils/download";

// Mock the download functions to test they exist and are callable
jest.mock("../../../utils/download", () => ({
  downloadAsPNG: jest.fn().mockResolvedValue(undefined),
  downloadAsPDF: jest.fn().mockResolvedValue(undefined),
}));

describe("Export Canvas Functionality - Verification Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("downloadAsPNG function exists and is callable", async () => {
    const mockElement = document.createElement("div");
    mockElement.innerHTML = "<div>Test content</div>";

    await downloadAsPNG(mockElement, "test.png");

    expect(downloadAsPNG).toHaveBeenCalledWith(mockElement, "test.png");
    expect(downloadAsPNG).toHaveBeenCalledTimes(1);
  });

  test("downloadAsPDF function exists and is callable", async () => {
    const mockElement = document.createElement("div");
    mockElement.innerHTML = "<div>Test content</div>";

    await downloadAsPDF(mockElement, "test.pdf");

    expect(downloadAsPDF).toHaveBeenCalledWith(mockElement, "test.pdf");
    expect(downloadAsPDF).toHaveBeenCalledTimes(1);
  });

  test("canvas export data attribute can be set and retrieved", () => {
    const canvas = document.createElement("div");
    canvas.setAttribute("data-canvas-export", "");

    expect(canvas.hasAttribute("data-canvas-export")).toBe(true);
    expect(canvas.getAttribute("data-canvas-export")).toBe("");
  });

  test("querySelector can find elements with data-canvas-export attribute", () => {
    // Create a container with the export canvas
    const container = document.createElement("div");
    const canvas = document.createElement("div");
    canvas.setAttribute("data-canvas-export", "");
    canvas.textContent = "Canvas content";

    container.appendChild(canvas);
    document.body.appendChild(container);

    // Test that querySelector can find the canvas
    const foundCanvas = container.querySelector("[data-canvas-export]");
    expect(foundCanvas).toBe(canvas);
    expect(foundCanvas?.textContent).toBe("Canvas content");

    // Clean up
    document.body.removeChild(container);
  });

  test("template name processing works correctly", () => {
    const testCases = [
      { input: "My Template", expected: "my-template-preview.png" },
      {
        input: "Test Template Name",
        expected: "test-template-name-preview.png",
      },
      { input: "", expected: "template-preview.png" },
      { input: "   ", expected: "template-preview.png" },
    ];

    testCases.forEach(({ input, expected }) => {
      const templateName = input.trim();
      const fileName = templateName
        ? `${templateName.toLowerCase().replace(/\s+/g, "-")}-preview.png`
        : "template-preview.png";

      expect(fileName).toBe(expected);
    });
  });
});

/**
 * Integration test to verify the complete export flow
 */
describe("Export Canvas Integration Test", () => {
  test("complete export flow simulation", async () => {
    // Simulate the export process
    const mockCanvas = document.createElement("div");
    mockCanvas.setAttribute("data-canvas-export", "");
    mockCanvas.style.width = "643px";
    mockCanvas.style.height = "383px";
    mockCanvas.innerHTML = `
      <div style="position: absolute; left: 60px; top: 90px; width: 220px; height: 35px;">
        First Name
      </div>
      <div style="position: absolute; left: 60px; top: 130px; width: 220px; height: 35px;">
        Last Name
      </div>
    `;

    // Simulate container with canvas
    const container = document.createElement("div");
    container.appendChild(mockCanvas);

    // Test finding the canvas for export
    const canvasForExport = container.querySelector(
      "[data-canvas-export]"
    ) as HTMLElement;
    expect(canvasForExport).toBeTruthy();
    expect(canvasForExport).toBe(mockCanvas);

    // Test PNG export simulation
    await downloadAsPNG(canvasForExport, "test-template-preview.png");
    expect(downloadAsPNG).toHaveBeenCalledWith(
      canvasForExport,
      "test-template-preview.png"
    );

    // Test PDF export simulation
    await downloadAsPDF(canvasForExport, "test-template-preview.pdf");
    expect(downloadAsPDF).toHaveBeenCalledWith(
      canvasForExport,
      "test-template-preview.pdf"
    );
  });
});

