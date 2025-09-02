import React from "react";

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

interface DraggableFieldProps {
  field: FieldDefinition;
  onDragStart: (field: FieldDefinition) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({
  field,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", JSON.stringify(field));
    onDragStart(field);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return "📝";
      case "textarea":
        return "📄";
      case "image":
        return "🖼️";
      default:
        return "📝";
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:cursor-grabbing"
    >
      <span className="text-lg mr-3">{getFieldIcon(field.type)}</span>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{field.label}</div>
        <div className="text-sm text-gray-500">{field.placeholder}</div>
      </div>
      <div className="text-xs text-gray-400 ml-2">
        {field.defaultSize.w}×{field.defaultSize.h}
      </div>
    </div>
  );
};

export default DraggableField;

