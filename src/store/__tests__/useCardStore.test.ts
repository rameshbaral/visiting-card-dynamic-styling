import { renderHook, act } from "@testing-library/react";
import { useCardStore } from "../useCardStore";
import type { TemplateDesign } from "../../types";

// Mock the templates
jest.mock("../../templates", () => ({
  templates: [
    {
      id: "test-template",
      name: "Test Template",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    },
  ],
  getDefaultTemplate: () => ({
    id: "test-template",
    name: "Test Template",
    fields: [],
    shapes: [],
    size: { width: 643, height: 383 },
    background: null,
  }),
}));

describe("useCardStore - Custom Template Management", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test("initializes with empty custom templates", () => {
    const { result } = renderHook(() => useCardStore());

    expect(result.current.customTemplates).toEqual([]);
  });

  test("adds custom template", () => {
    const { result } = renderHook(() => useCardStore());

    const customTemplate: TemplateDesign = {
      id: "custom-1",
      name: "Custom Template 1",
      fields: [
        {
          key: "firstName",
          label: "First Name",
          box: { x: 10, y: 10, w: 100, h: 30 },
          style: { fontFamily: "Arial", fontSize: 16, color: "#000000" },
          placeholder: "First Name",
        },
      ],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    act(() => {
      result.current.addCustomTemplate(customTemplate);
    });

    expect(result.current.customTemplates).toHaveLength(1);
    expect(result.current.customTemplates[0]).toEqual(customTemplate);
  });

  test("replaces existing custom template with same ID", () => {
    const { result } = renderHook(() => useCardStore());

    const template1: TemplateDesign = {
      id: "custom-1",
      name: "Template 1",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    const template1Updated: TemplateDesign = {
      id: "custom-1",
      name: "Template 1 Updated",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    act(() => {
      result.current.addCustomTemplate(template1);
    });

    expect(result.current.customTemplates).toHaveLength(1);
    expect(result.current.customTemplates[0].name).toBe("Template 1");

    act(() => {
      result.current.addCustomTemplate(template1Updated);
    });

    expect(result.current.customTemplates).toHaveLength(1);
    expect(result.current.customTemplates[0].name).toBe("Template 1 Updated");
  });

  test("removes custom template", () => {
    const { result } = renderHook(() => useCardStore());

    const customTemplate: TemplateDesign = {
      id: "custom-1",
      name: "Custom Template 1",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    act(() => {
      result.current.addCustomTemplate(customTemplate);
    });

    expect(result.current.customTemplates).toHaveLength(1);

    act(() => {
      result.current.removeCustomTemplate("custom-1");
    });

    expect(result.current.customTemplates).toHaveLength(0);
  });

  test("setTemplate works with custom templates", () => {
    const { result } = renderHook(() => useCardStore());

    const customTemplate: TemplateDesign = {
      id: "custom-1",
      name: "Custom Template 1",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
      defaults: { firstName: "John" },
    };

    act(() => {
      result.current.addCustomTemplate(customTemplate);
    });

    act(() => {
      result.current.setTemplate("custom-1");
    });

    expect(result.current.currentTemplateId).toBe("custom-1");
    expect(result.current.currentTemplate).toEqual(customTemplate);
    expect(result.current.fields.firstName).toBe("John");
  });

  test("setTemplate handles non-existent template", () => {
    const { result } = renderHook(() => useCardStore());

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    act(() => {
      result.current.setTemplate("non-existent");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Template not found:",
      "non-existent"
    );

    consoleSpy.mockRestore();
  });

  test("persists custom templates to localStorage", () => {
    const { result } = renderHook(() => useCardStore());

    const customTemplate: TemplateDesign = {
      id: "custom-1",
      name: "Custom Template 1",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    act(() => {
      result.current.addCustomTemplate(customTemplate);
    });

    // Check if localStorage was updated
    const storedData = localStorage.getItem("card-designer-storage");
    expect(storedData).toBeTruthy();

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      expect(parsedData.state.customTemplates).toHaveLength(1);
      expect(parsedData.state.customTemplates[0]).toEqual(customTemplate);
    }
  });

  test("loads custom templates from localStorage", () => {
    const customTemplate: TemplateDesign = {
      id: "custom-1",
      name: "Custom Template 1",
      fields: [],
      shapes: [],
      size: { width: 643, height: 383 },
      background: null,
    };

    // Pre-populate localStorage
    const initialState = {
      state: {
        currentTemplateId: "test-template",
        customTemplates: [customTemplate],
        fields: {},
        logo: null,
        savedDesigns: [],
      },
      version: 0,
    };

    localStorage.setItem("card-designer-storage", JSON.stringify(initialState));

    const { result } = renderHook(() => useCardStore());

    expect(result.current.customTemplates).toHaveLength(1);
    expect(result.current.customTemplates[0]).toEqual(customTemplate);
  });
});
