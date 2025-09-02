import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TemplatePicker from "../TemplatePicker";
import { useCardStore } from "../../store/useCardStore";

// Mock the store
jest.mock("../../store/useCardStore");
const mockUseCardStore = useCardStore as jest.MockedFunction<
  typeof useCardStore
>;

// Mock templates
jest.mock("../../templates", () => ({
  templates: [
    {
      id: "test-template",
      name: "Test Template",
      fields: [{ key: "firstName" }, { key: "lastName" }],
      shapes: [],
    },
  ],
}));

describe("TemplatePicker Component - Import Functionality Tests", () => {
  const mockSetTemplate = jest.fn();
  const mockAddCustomTemplate = jest.fn();
  const mockRemoveCustomTemplate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCardStore.mockReturnValue({
      currentTemplateId: "test-template",
      setTemplate: mockSetTemplate,
      customTemplates: [],
      addCustomTemplate: mockAddCustomTemplate,
      removeCustomTemplate: mockRemoveCustomTemplate,
      currentTemplate: {} as any,
      fields: {} as any,
      logo: null,
      setField: jest.fn(),
      setLogo: jest.fn(),
      resetFields: jest.fn(),
      savedDesigns: [],
      saveDesign: jest.fn(),
      loadDesign: jest.fn(),
      deleteDesign: jest.fn(),
    });
  });

  test("renders import template button", () => {
    render(<TemplatePicker />);

    expect(screen.getByText("Import Template")).toBeInTheDocument();
  });

  test("renders templates with custom template indicator", () => {
    mockUseCardStore.mockReturnValue({
      currentTemplateId: "custom-template",
      setTemplate: mockSetTemplate,
      customTemplates: [
        {
          id: "custom-template",
          name: "Custom Template",
          fields: [{ key: "firstName" }],
          shapes: [],
          size: { width: 643, height: 383 },
          background: null,
        },
      ],
      addCustomTemplate: mockAddCustomTemplate,
      removeCustomTemplate: mockRemoveCustomTemplate,
      currentTemplate: {} as any,
      fields: {} as any,
      logo: null,
      setField: jest.fn(),
      setLogo: jest.fn(),
      resetFields: jest.fn(),
      savedDesigns: [],
      saveDesign: jest.fn(),
      loadDesign: jest.fn(),
      deleteDesign: jest.fn(),
    });

    render(<TemplatePicker />);

    expect(screen.getByText("Custom Template")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  test("shows delete button for custom templates", () => {
    mockUseCardStore.mockReturnValue({
      currentTemplateId: "test-template",
      setTemplate: mockSetTemplate,
      customTemplates: [
        {
          id: "custom-template",
          name: "Custom Template",
          fields: [{ key: "firstName" }],
          shapes: [],
          size: { width: 643, height: 383 },
          background: null,
        },
      ],
      addCustomTemplate: mockAddCustomTemplate,
      removeCustomTemplate: mockRemoveCustomTemplate,
      currentTemplate: {} as any,
      fields: {} as any,
      logo: null,
      setField: jest.fn(),
      setLogo: jest.fn(),
      resetFields: jest.fn(),
      savedDesigns: [],
      saveDesign: jest.fn(),
      loadDesign: jest.fn(),
      deleteDesign: jest.fn(),
    });

    render(<TemplatePicker />);

    const deleteButton = screen.getByTitle("Delete custom template");
    expect(deleteButton).toBeInTheDocument();
  });

  test("calls removeCustomTemplate when delete button is clicked", () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    mockUseCardStore.mockReturnValue({
      currentTemplateId: "test-template",
      setTemplate: mockSetTemplate,
      customTemplates: [
        {
          id: "custom-template",
          name: "Custom Template",
          fields: [{ key: "firstName" }],
          shapes: [],
          size: { width: 643, height: 383 },
          background: null,
        },
      ],
      addCustomTemplate: mockAddCustomTemplate,
      removeCustomTemplate: mockRemoveCustomTemplate,
      currentTemplate: {} as any,
      fields: {} as any,
      logo: null,
      setField: jest.fn(),
      setLogo: jest.fn(),
      resetFields: jest.fn(),
      savedDesigns: [],
      saveDesign: jest.fn(),
      loadDesign: jest.fn(),
      deleteDesign: jest.fn(),
    });

    render(<TemplatePicker />);

    const deleteButton = screen.getByTitle("Delete custom template");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete the template "Custom Template"?'
    );
    expect(mockRemoveCustomTemplate).toHaveBeenCalledWith("custom-template");
  });

  test("does not delete template when confirmation is cancelled", () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    mockUseCardStore.mockReturnValue({
      currentTemplateId: "test-template",
      setTemplate: mockSetTemplate,
      customTemplates: [
        {
          id: "custom-template",
          name: "Custom Template",
          fields: [{ key: "firstName" }],
          shapes: [],
          size: { width: 643, height: 383 },
          background: null,
        },
      ],
      addCustomTemplate: mockAddCustomTemplate,
      removeCustomTemplate: mockRemoveCustomTemplate,
      currentTemplate: {} as any,
      fields: {} as any,
      logo: null,
      setField: jest.fn(),
      setLogo: jest.fn(),
      resetFields: jest.fn(),
      savedDesigns: [],
      saveDesign: jest.fn(),
      loadDesign: jest.fn(),
      deleteDesign: jest.fn(),
    });

    render(<TemplatePicker />);

    const deleteButton = screen.getByTitle("Delete custom template");
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockRemoveCustomTemplate).not.toHaveBeenCalled();
  });

  test("file input accepts only JSON files", () => {
    render(<TemplatePicker />);

    const fileInput = screen
      .getByRole("button", { name: "Import Template" })
      .parentElement?.querySelector('input[type="file"]');

    expect(fileInput).toHaveAttribute("accept", ".json");
  });

  test("template selection calls setTemplate", () => {
    render(<TemplatePicker />);

    const templateButton = screen.getByText("Test Template").closest("div");
    if (templateButton) {
      fireEvent.click(templateButton);
    }

    expect(mockSetTemplate).toHaveBeenCalledWith("test-template");
  });
});
