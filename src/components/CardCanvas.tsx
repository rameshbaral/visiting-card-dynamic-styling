import React, { useRef, useState } from "react";
import { useCardStore } from "../store/useCardStore";
import type { Shape, FieldSpec } from "../types";

interface CardCanvasProps {
  isExporting?: boolean;
  isEditing?: boolean;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  isExporting = false,
  isEditing = true,
  canvasRef: externalCanvasRef,
}) => {
  const internalCanvasRef = useRef<HTMLDivElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const { currentTemplate, fields, logo, setField } = useCardStore();
  const [editingField, setEditingField] = useState<string | null>(null);

  const renderShape = (shape: Shape, index: number) => {
    switch (shape.type) {
      case "rect":
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.w,
              height: shape.h,
              backgroundColor: shape.fill,
              borderRadius: shape.radius,
            }}
          />
        );

      case "polygon": {
        const points = shape.points.map((p) => `${p.x},${p.y}`).join(" ");
        return (
          <svg
            key={index}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: currentTemplate.size.width,
              height: currentTemplate.size.height,
            }}
          >
            <polygon points={points} fill={shape.fill} />
          </svg>
        );
      }

      case "image":
        return (
          <img
            key={index}
            src={shape.path}
            alt="Background"
            className="absolute object-cover"
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.w,
              height: shape.h,
              objectFit: shape.fit || "cover",
              borderRadius: shape.radius,
            }}
          />
        );

      case "dashedRect":
        if (isExporting) return null; // Hide dashed rectangles during export
        return (
          <div
            key={index}
            className="absolute border-2 border-dashed"
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.w,
              height: shape.h,
              borderColor: shape.stroke,
              borderStyle: "dashed",
              borderRadius: shape.radius,
            }}
          />
        );

      default:
        return null;
    }
  };

  const renderField = (field: FieldSpec, index: number) => {
    const value = fields[field.key] || "";
    const style = field.style;
    const isEditingThisField = editingField === field.key;

    const textStyle = {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.weight,
      color: style.color,
      letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight,
      textAlign: style.align as "left" | "center" | "right",
      textTransform: style.uppercase
        ? ("uppercase" as const)
        : ("none" as const),
      opacity: style.opacity,
    };

    const handleFieldClick = () => {
      if (isEditing && field.key !== "logo") {
        setEditingField(field.key);
      }
    };

    const handleFieldBlur = () => {
      setEditingField(null);
    };

    const handleFieldChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setField(field.key, e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && field.key !== "address") {
        setEditingField(null);
      }
    };

    return (
      <div
        key={index}
        className="absolute"
        style={{
          left: field.box.x,
          top: field.box.y,
          width: field.box.w,
          height: field.box.h,
        }}
      >
        {field.key === "logo" ? (
          logo ? (
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Logo
            </div>
          )
        ) : isEditing && isEditingThisField ? (
          field.key === "address" ? (
            <textarea
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              placeholder={field.placeholder}
              className="w-full h-full bg-transparent border-none outline-none resize-none"
              style={textStyle}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              placeholder={field.placeholder}
              className="w-full h-full bg-transparent border-none outline-none"
              style={textStyle}
              autoFocus
            />
          )
        ) : (
          <div
            className={`w-full h-full flex items-center ${
              isEditing
                ? "cursor-text hover:bg-white hover:bg-opacity-10 rounded px-1"
                : ""
            }`}
            style={textStyle}
            onClick={handleFieldClick}
          >
            {value || (isExporting ? "" : field.placeholder)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-sm text-gray-600">
        Click on fields to edit them. Upload a logo using the controls on the
        right.
      </div>

      <div
        ref={canvasRef}
        data-canvas-export
        className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{
          width: 643,
          height: 383,
          backgroundColor: currentTemplate.background?.color || "transparent",
        }}
      >
        {/* Render shapes */}
        {currentTemplate.shapes.map(renderShape)}

        {/* Render fields */}
        {currentTemplate.fields.map(renderField)}
      </div>

      {/* Canvas info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Canvas: 643×383px (Business Card Size)
      </div>
    </div>
  );
};

export default CardCanvas;
