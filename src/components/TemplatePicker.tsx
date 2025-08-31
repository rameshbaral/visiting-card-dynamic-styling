import React from "react";
import { useCardStore } from "../store/useCardStore";
import { templates } from "../templates";

const TemplatePicker: React.FC = () => {
  const { currentTemplateId, setTemplate } = useCardStore();

  const handleTemplateSelect = (templateId: string) => {
    try {
      setTemplate(templateId);
    } catch (error) {
      console.error("Error setting template:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Templates</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg border-2 transition-all ${
              currentTemplateId === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="p-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-16 h-10 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-600"
                  style={{
                    backgroundImage: template.shapes.find(
                      (s) => s.type === "image"
                    )
                      ? `url(${
                          template.shapes.find((s) => s.type === "image")?.path
                        })`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!template.shapes.find((s) => s.type === "image") && (
                    <span className="text-xs">Preview</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">
                    {template.fields.length} fields
                  </p>
                </div>
                {currentTemplateId === template.id && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatePicker;
