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

const CanvasDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [droppedFields, setDroppedFields] = useState<FieldSpec[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [templateName, setTemplateName] = useState<string>("");

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
      x: 20,
      y: 20,
      w: 603,
      h: 343,
      fill: "#FFFFFF",
      radius: 12,
    });

    // Add background image if selected
    if (selectedBackground) {
      shapes.push({
        type: "image",
        x: 20,
        y: 20,
        w: 603,
        h: 343,
        path: selectedBackground,
        fit: "cover",
        radius: 12,
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Template Designer
            </h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleExportCanvasPNG}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={droppedFields.length === 0}
                title="Export canvas as PNG image"
              >
                Export PNG
              </button>
              <button
                onClick={handleExportCanvasPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                disabled={droppedFields.length === 0}
                title="Export canvas as PDF"
              >
                Export PDF
              </button>
              <button
                onClick={generateTemplateJSON}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={droppedFields.length === 0 || !templateName.trim()}
                title="Export template configuration as JSON"
              >
                Export Template
              </button>
              <button
                onClick={clearCanvas}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Canvas
              </button>
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
