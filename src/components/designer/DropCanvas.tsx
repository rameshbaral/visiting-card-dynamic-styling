import React, { useState, useRef } from "react";
import type { FieldSpec } from "../../types";

interface DropCanvasProps {
  backgroundImage: string | null;
  droppedFields: FieldSpec[];
  onFieldDrop: (field: FieldSpec) => void;
  onFieldMove: (
    fieldKey: string,
    newPosition: { x: number; y: number }
  ) => void;
  onFieldSelect: (fieldKey: string | null) => void;
  selectedField: string | null;
  showGrid?: boolean;
}

const DropCanvas: React.FC<DropCanvasProps> = ({
  backgroundImage,
  droppedFields,
  onFieldDrop,
  onFieldMove,
  onFieldSelect,
  selectedField,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [_dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      const fieldData = JSON.parse(e.dataTransfer.getData("text/plain"));

      // Create new field spec
      const newField: FieldSpec = {
        key: fieldData.key,
        label: fieldData.label,
        box: {
          x: Math.max(
            0,
            Math.min(
              x - fieldData.defaultSize.w / 2,
              643 - fieldData.defaultSize.w
            )
          ),
          y: Math.max(
            0,
            Math.min(
              y - fieldData.defaultSize.h / 2,
              383 - fieldData.defaultSize.h
            )
          ),
          w: fieldData.defaultSize.w,
          h: fieldData.defaultSize.h,
        },
        style: fieldData.defaultStyle,
        placeholder: fieldData.placeholder,
      };

      onFieldDrop(newField);
    } catch (error) {
      console.error("Error parsing dropped field data:", error);
    }
  };

  const handleFieldMouseDown = (e: React.MouseEvent, fieldKey: string) => {
    e.preventDefault();
    e.stopPropagation();

    const field = droppedFields.find((f) => f.key === fieldKey);
    if (!field || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - field.box.x;
    const offsetY = e.clientY - rect.top - field.box.y;

    setDraggedField(fieldKey);
    setDragOffset({ x: offsetX, y: offsetY });
    onFieldSelect(fieldKey);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(
        0,
        Math.min(e.clientX - rect.left - offsetX, 643 - field.box.w)
      );
      const newY = Math.max(
        0,
        Math.min(e.clientY - rect.top - offsetY, 383 - field.box.h)
      );

      onFieldMove(fieldKey, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setDraggedField(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onFieldSelect(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-sm text-gray-600">
        Drag fields from the left sidebar to place them on the canvas. Click and
        drag placed fields to reposition them.
      </div>

      <div
        ref={canvasRef}
        data-canvas-export
        className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{
          width: 643,
          height: 383,
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {/* Grid overlay for better positioning */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}

        {/* Render dropped fields */}
        {droppedFields.map((field, index) => (
          <div
            key={`${field.key}-${index}`}
            className={`absolute cursor-move border-2 transition-all duration-200 ${
              selectedField === field.key
                ? "border-blue-500 bg-blue-50 bg-opacity-50"
                : "border-transparent hover:border-gray-400 hover:bg-gray-50 hover:bg-opacity-50"
            } ${draggedField === field.key ? "shadow-lg" : ""}`}
            style={{
              left: field.box.x,
              top: field.box.y,
              width: field.box.w,
              height: field.box.h,
              fontFamily: field.style.fontFamily,
              fontSize: field.style.fontSize,
              fontWeight: field.style.weight,
              color: field.style.color,
            }}
            onMouseDown={(e) => handleFieldMouseDown(e, field.key)}
          >
            <div className="w-full h-full flex items-center justify-center text-center p-2 rounded">
              {field.placeholder}
            </div>

            {/* Field label when selected */}
            {selectedField === field.key && (
              <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {field.label}
              </div>
            )}
          </div>
        ))}

        {/* Drop zone indicator */}
        {droppedFields.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <div>Drop fields here to design your card</div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Canvas: 643×383px (Business Card Size)
      </div>
    </div>
  );
};

export default DropCanvas;
