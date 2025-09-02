import React, { useState, useRef } from "react";
import DraggableField from "./DraggableField";
import DropCanvas from "./DropCanvas";
import BackgroundSelector from "./BackgroundSelector";
import { downloadAsPNG, downloadAsPDF } from "../../utils/download";
import type { FieldSpec } from "../../types";
import fieldDefinitions from "../../data/fieldDefinitions.json";

interface FieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  type: string;
  defaultStyle: {
    fontFamily?: string;
    fontSize?: number;
    weight?: string | number;
    color?: string;
  };
  defaultSize: { w: number; h: number };
}

interface CanvasDesignerProps {
  onNavigateToEditor?: () => void;
}

const CanvasDesigner: React.FC<CanvasDesignerProps> = ({
  onNavigateToEditor,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [droppedFields, setDroppedFields] = useState<FieldSpec[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [templateName, setTemplateName] = useState<string>("");
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const handleFieldDrop = (field: FieldSpec) => {
    // Check if field already exists
    const existingFieldIndex = droppedFields.findIndex(
      (f) => f.key === field.key
    );

    if (existingFieldIndex >= 0) {
      // Update existing field position
      const updatedFields = [...droppedFields];
      updatedFields[existingFieldIndex] = field;
      setDroppedFields(updatedFields);
    } else {
      // Add new field
      setDroppedFields((prev) => [...prev, field]);
    }

    setSelectedField(field.key);
  };

  const handleFieldMove = (
    fieldKey: string,
    newPosition: { x: number; y: number }
  ) => {
    setDroppedFields((prev) =>
      prev.map((field) =>
        field.key === fieldKey
          ? {
              ...field,
              box: { ...field.box, x: newPosition.x, y: newPosition.y },
            }
          : field
      )
    );
  };

  const handleFieldDelete = (fieldKey: string) => {
    setDroppedFields((prev) => prev.filter((field) => field.key !== fieldKey));
    if (selectedField === fieldKey) {
      setSelectedField(null);
    }
  };

  const handleDragStart = (_field: FieldDefinition) => {
    // Optional: Handle drag start if needed
  };

  const handleExportCanvasPNG = async () => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector(
        "[data-canvas-export]"
      ) as HTMLElement;
      if (canvasElement) {
        await downloadAsPNG(
          canvasElement,
          `${templateName || "template"}-preview.png`
        );
      }
    }
  };

  const handleExportCanvasPDF = async () => {
    if (canvasRef.current) {
      const canvasElement = canvasRef.current.querySelector(
        "[data-canvas-export]"
      ) as HTMLElement;
      if (canvasElement) {
        await downloadAsPDF(
          canvasElement,
          `${templateName || "template"}-preview.pdf`
        );
      }
    }
  };

  const generateTemplateJSON = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    const templateId = templateName.toLowerCase().replace(/\s+/g, "");

    const shapes = [];

    // Add background rectangle
    shapes.push({
      type: "rect",
      x: 0,
      y: 0,
      w: 643,
      h: 383,
      fill: "#FFFFFF",
      radius: 0,
    });

    // Add background image if selected
    if (selectedBackground) {
      shapes.push({
        type: "image",
        x: 0,
        y: 0,
        w: 643,
        h: 383,
        path: selectedBackground,
        fit: "cover",
        radius: 0,
      });
    }

    // Add logo placeholder if logo field exists
    const logoField = droppedFields.find((field) => field.key === "logo");
    if (logoField) {
      shapes.push({
        type: "dashedRect",
        x: logoField.box.x,
        y: logoField.box.y,
        w: logoField.box.w,
        h: logoField.box.h,
        stroke: "#B9B9B9",
        dash: [6, 6],
        radius: 4,
      });
    }

    const template = {
      id: templateId,
      name: templateName,
      size: { width: 643, height: 383 },
      background: { color: "#FFFFFF" },
      shapes: shapes,
      fields: droppedFields.map((field) => ({
        key: field.key,
        label: field.label,
        box: field.box,
        style: field.style,
        placeholder: field.placeholder,
      })),
      defaults: {},
    };

    // Create and download JSON file
    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCanvas = () => {
    if (
      confirm(
        "Are you sure you want to clear the canvas? This action cannot be undone."
      )
    ) {
      setDroppedFields([]);
      setSelectedField(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Title and Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Template Designer
                  </h1>
                  <p className="text-xs text-gray-500 -mt-0.5">
                    Create custom visiting card templates
                  </p>
                </div>
              </div>

              {onNavigateToEditor && (
                <>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <button
                    onClick={onNavigateToEditor}
                    className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Card Editor
                  </button>
                </>
              )}
            </div>

            {/* Right Section - Template Name and Actions */}
            <div className="flex items-center space-x-4">
              {/* Template Name Input */}
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="templateName"
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Template Name:
                </label>
                <input
                  id="templateName"
                  type="text"
                  placeholder="Enter template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-48 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div className="h-6 w-px bg-gray-200"></div>

              {/* Compact Action Buttons */}
              <div className="flex items-center space-x-1">
                {/* Grid Toggle */}
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                    showGrid
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                  title={showGrid ? "Hide Grid" : "Show Grid"}
                >
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {showGrid ? "Hide" : "Show"} Grid
                </button>

                {/* Export Group */}
                <div className="flex items-center bg-gray-50 rounded-md p-0.5">
                  <button
                    onClick={handleExportCanvasPNG}
                    className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-green-700 bg-white border border-green-200 rounded-sm hover:bg-green-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={droppedFields.length === 0}
                    title="Export canvas as PNG image"
                  >
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    PNG
                  </button>
                  <button
                    onClick={handleExportCanvasPDF}
                    className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-sm hover:bg-purple-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={droppedFields.length === 0}
                    title="Export canvas as PDF"
                  >
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    PDF
                  </button>
                </div>

                <button
                  onClick={generateTemplateJSON}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={droppedFields.length === 0 || !templateName.trim()}
                  title="Export template configuration as JSON"
                >
                  <svg
                    className="w-3.5 h-3.5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Template
                </button>

                <button
                  onClick={clearCanvas}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
                  title="Clear all fields from canvas"
                >
                  <svg
                    className="w-3.5 h-3.5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Fields */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Available Fields
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fieldDefinitions.map((field) => (
                  <DraggableField
                    key={field.key}
                    field={field}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>

            {/* Background Selector */}
            <BackgroundSelector
              selectedBackground={selectedBackground}
              onBackgroundSelect={setSelectedBackground}
            />

            {/* Field Properties */}
            {selectedField && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Field Properties
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selected Field
                    </label>
                    <div className="text-sm text-gray-600">
                      {
                        droppedFields.find((f) => f.key === selectedField)
                          ?.label
                      }
                    </div>
                  </div>
                  <button
                    onClick={() => handleFieldDelete(selectedField)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Field
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Design Canvas
                </h3>
                <div className="text-sm text-gray-600">
                  Fields: {droppedFields.length} | Selected:{" "}
                  {selectedField || "None"}
                </div>
              </div>

              <div ref={canvasRef}>
                <DropCanvas
                  backgroundImage={selectedBackground}
                  droppedFields={droppedFields}
                  onFieldDrop={handleFieldDrop}
                  onFieldMove={handleFieldMove}
                  onFieldSelect={setSelectedField}
                  selectedField={selectedField}
                  showGrid={showGrid}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                Instructions:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Drag fields from the left sidebar to place them on the
                  canvas
                </li>
                <li>• Click and drag placed fields to reposition them</li>
                <li>• Select a background image or use no background</li>
                <li>• Click on placed fields to select and view properties</li>
                <li>
                  • Enter a template name and click "Export Template" to
                  download the JSON
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDesigner;
