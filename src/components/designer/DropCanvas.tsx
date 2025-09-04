import React, { useState, useRef } from "react";
import type { FieldSpec } from "../../types";
import { iconLibrary, IconDisplay, type IconDefinition } from "./IconLibrary";
import IconSelector from "./IconSelector";

interface DropCanvasProps {
  backgroundImage: string | null;
  droppedFields: FieldSpec[];
  onFieldDrop: (field: FieldSpec) => void;
  onFieldMove: (
    fieldKey: string,
    newPosition: { x: number; y: number }
  ) => void;
  onFieldSelect: (fieldKey: string | null) => void;
  onFieldDelete?: (fieldKey: string) => void;
  onFieldResize?: (fieldKey: string, newSize: { w: number; h: number }) => void;
  onFieldIconUpdate?: (fieldKey: string, iconId: string | null) => void;
  selectedField: string | null;
  showGrid?: boolean;
}

const DropCanvas: React.FC<DropCanvasProps> = ({
  backgroundImage,
  droppedFields,
  onFieldDrop,
  onFieldMove,
  onFieldSelect,
  onFieldDelete,
  onFieldResize,
  onFieldIconUpdate,
  selectedField,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [resizingField, setResizingField] = useState<string | null>(null);
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null);
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
        type: fieldData.type,
        ...(fieldData.type === "icon" && { iconId: fieldData.defaultIcon }),
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
          <div className="absolute inset-0 pointer-events-none opacity-60">
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
                    stroke="#6b7280"
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
            className={`absolute cursor-move border-2 rounded-md ${
              resizingField === field.key
                ? "border-blue-600 bg-blue-100 bg-opacity-60 shadow-lg transition-none"
                : selectedField === field.key
                ? "border-blue-500 bg-blue-50 bg-opacity-50 shadow-md transition-all duration-200"
                : "border-gray-300 bg-white bg-opacity-90 hover:border-blue-400 hover:shadow-sm transition-all duration-200"
            } ${draggedField === field.key ? "shadow-lg border-blue-600" : ""}`}
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
              {field.type === "icon" ? (
                field.iconId ? (
                  <IconDisplay
                    icon={iconLibrary.find((icon) => icon.id === field.iconId)!}
                    size={Math.min(field.box.w - 8, field.box.h - 8)}
                    color={field.style.color}
                  />
                ) : (
                  <div
                    className="text-gray-300 text-xs cursor-pointer hover:text-gray-500 flex items-center justify-center border-2 border-dashed border-gray-200 rounded h-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIconSelector(field.key);
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">⭐</div>
                      <div>Icon</div>
                    </div>
                  </div>
                )
              ) : (
                field.label || field.placeholder
              )}
            </div>

            {/* Field label when selected */}
            {selectedField === field.key && (
              <>
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {field.label}
                </div>
                <div className="absolute -top-2 -right-2 flex space-x-1">
                  {field.type === "icon" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowIconSelector(field.key);
                      }}
                      className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center transition-colors shadow-md"
                      title="Change icon"
                    >
                      ⭐
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onFieldDelete) {
                        onFieldDelete(field.key);
                      }
                    }}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center transition-colors shadow-md"
                    title="Delete field"
                  >
                    ×
                  </button>
                </div>

                {/* Resize handles */}
                {onFieldResize && (
                  <>
                    {/* Bottom-right resize handle */}
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize hover:bg-blue-600 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setResizingField(field.key);
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = field.box.w;
                        const startHeight = field.box.h;

                        let rafId: number | null = null;
                        let lastUpdate = 0;

                        const handleMouseMove = (e: MouseEvent) => {
                          const now = Date.now();
                          if (now - lastUpdate < 16) return; // Throttle to ~60fps

                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }

                          rafId = requestAnimationFrame(() => {
                            const deltaX = e.clientX - startX;
                            const deltaY = e.clientY - startY;

                            const newWidth = Math.max(
                              50,
                              Math.min(400, startWidth + deltaX)
                            );
                            const newHeight = Math.max(
                              20,
                              Math.min(200, startHeight + deltaY)
                            );

                            onFieldResize(field.key, {
                              w: newWidth,
                              h: newHeight,
                            });
                            lastUpdate = now;
                          });
                        };

                        const handleMouseUp = () => {
                          setResizingField(null);
                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }
                          document.removeEventListener(
                            "mousemove",
                            handleMouseMove
                          );
                          document.removeEventListener(
                            "mouseup",
                            handleMouseUp
                          );
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                      }}
                      title="Resize field"
                    />

                    {/* Right edge resize handle */}
                    <div
                      className="absolute top-1/2 -right-1 w-2 h-6 bg-blue-500 border border-white rounded-sm cursor-e-resize hover:bg-blue-600 transition-colors transform -translate-y-1/2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setResizingField(field.key);
                        const startX = e.clientX;
                        const startWidth = field.box.w;

                        let rafId: number | null = null;
                        let lastUpdate = 0;

                        const handleMouseMove = (e: MouseEvent) => {
                          const now = Date.now();
                          if (now - lastUpdate < 16) return; // Throttle to ~60fps

                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }

                          rafId = requestAnimationFrame(() => {
                            const deltaX = e.clientX - startX;
                            const newWidth = Math.max(
                              50,
                              Math.min(400, startWidth + deltaX)
                            );

                            onFieldResize(field.key, {
                              w: newWidth,
                              h: field.box.h,
                            });
                            lastUpdate = now;
                          });
                        };

                        const handleMouseUp = () => {
                          setResizingField(null);
                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }
                          document.removeEventListener(
                            "mousemove",
                            handleMouseMove
                          );
                          document.removeEventListener(
                            "mouseup",
                            handleMouseUp
                          );
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                      }}
                      title="Resize width"
                    />

                    {/* Bottom edge resize handle */}
                    <div
                      className="absolute -bottom-1 left-1/2 w-6 h-2 bg-blue-500 border border-white rounded-sm cursor-s-resize hover:bg-blue-600 transition-colors transform -translate-x-1/2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        setResizingField(field.key);
                        const startY = e.clientY;
                        const startHeight = field.box.h;

                        let rafId: number | null = null;
                        let lastUpdate = 0;

                        const handleMouseMove = (e: MouseEvent) => {
                          const now = Date.now();
                          if (now - lastUpdate < 16) return; // Throttle to ~60fps

                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }

                          rafId = requestAnimationFrame(() => {
                            const deltaY = e.clientY - startY;
                            const newHeight = Math.max(
                              20,
                              Math.min(200, startHeight + deltaY)
                            );

                            onFieldResize(field.key, {
                              w: field.box.w,
                              h: newHeight,
                            });
                            lastUpdate = now;
                          });
                        };

                        const handleMouseUp = () => {
                          setResizingField(null);
                          if (rafId) {
                            cancelAnimationFrame(rafId);
                          }
                          document.removeEventListener(
                            "mousemove",
                            handleMouseMove
                          );
                          document.removeEventListener(
                            "mouseup",
                            handleMouseUp
                          );
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                      }}
                      title="Resize height"
                    />
                  </>
                )}
              </>
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

      {/* Icon Selector Modal */}
      {showIconSelector && (
        <IconSelector
          selectedIcon={
            droppedFields.find((f) => f.key === showIconSelector)?.iconId
              ? iconLibrary.find(
                  (icon) =>
                    icon.id ===
                    droppedFields.find((f) => f.key === showIconSelector)
                      ?.iconId
                ) || null
              : null
          }
          onIconSelect={(icon) => {
            if (onFieldIconUpdate && showIconSelector) {
              onFieldIconUpdate(showIconSelector, icon?.id || null);
            }
          }}
          onClose={() => setShowIconSelector(null)}
        />
      )}
    </div>
  );
};

export default DropCanvas;
