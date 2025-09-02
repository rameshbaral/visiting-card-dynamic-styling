import React from "react";
import { useCardStore } from "../store/useCardStore";
import { templates } from "../templates";

const TemplatePicker: React.FC = () => {
  const {
    currentTemplateId,
    setTemplate,
    customTemplates,
    addCustomTemplate,
    removeCustomTemplate,
  } = useCardStore();

  const handleTemplateSelect = (templateId: string) => {
    try {
      setTemplate(templateId);
    } catch (error) {
      console.error("Error setting template:", error);
    }
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const templateData = JSON.parse(e.target?.result as string);
          // Validate template structure
          if (templateData.id && templateData.name && templateData.fields) {
            addCustomTemplate(templateData);
            alert(`Template "${templateData.name}" imported successfully!`);
          } else {
            alert("Invalid template format. Please check the JSON structure.");
          }
        } catch (error) {
          alert("Error parsing template file. Please check the JSON format.");
          console.error("Template import error:", error);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value so the same file can be imported again
    event.target.value = "";
  };

  const handleDeleteCustomTemplate = (
    templateId: string,
    templateName: string
  ) => {
    if (
      confirm(`Are you sure you want to delete the template "${templateName}"?`)
    ) {
      removeCustomTemplate(templateId);
    }
  };

  const allTemplates = [...templates, ...customTemplates];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Templates</h3>
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportTemplate}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
            Import Template
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allTemplates.map((template) => {
          const isCustomTemplate = customTemplates.some(
            (ct) => ct.id === template.id
          );
          return (
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
                            template.shapes.find((s) => s.type === "image")
                              ?.path
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
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                      {isCustomTemplate && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Custom
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {template.fields.length} fields
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentTemplateId === template.id && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    {isCustomTemplate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomTemplate(
                            template.id,
                            template.name
                          );
                        }}
                        className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded flex items-center justify-center text-sm transition-colors"
                        title="Delete custom template"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePicker;
