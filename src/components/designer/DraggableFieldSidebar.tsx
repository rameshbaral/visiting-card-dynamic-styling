import React, { useState } from "react";
import DraggableField from "./DraggableField";
import fieldDefinitions from "../../data/fieldDefinitions.json";

interface FieldDefinition {
  key: string;
  label: string;
  placeholder: string;
  type: string;
  defaultStyle: any;
  defaultSize: { w: number; h: number };
  defaultIcon?: string | null;
}

interface DraggableFieldSidebarProps {
  onDragStart: (field: FieldDefinition) => void;
}

type TemplateType = "userBased" | "companyBased";

const DraggableFieldSidebar: React.FC<DraggableFieldSidebarProps> = ({
  onDragStart,
}) => {
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<TemplateType>("userBased");
  const [customFields, setCustomFields] = useState<FieldDefinition[]>(
    fieldDefinitions.custom
  );
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [newFieldForm, setNewFieldForm] = useState({
    key: "",
    label: "",
    placeholder: "",
    type: "text",
    fontSize: 13,
    color: "#000000",
    weight: "normal",
    width: 150,
    height: 25,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Group user-based fields into logical categories for better organization
  const getUserFieldGroups = () => {
    const userFields = fieldDefinitions.userBased as FieldDefinition[];
    return {
      "Personal Info": userFields.filter((f) =>
        ["firstName", "lastName", "nameAR", "picture"].includes(f.key)
      ),
      "Contact Details": userFields.filter((f) =>
        [
          "directNumber",
          "mobile",
          "email",
          "email2",
          "phoneIcon",
          "emailIcon",
        ].includes(f.key)
      ),
      Professional: userFields.filter((f) =>
        ["occupation", "occupationAR", "department", "departmentAR"].includes(
          f.key
        )
      ),
      "Company Info": userFields.filter((f) =>
        ["company", "branch", "landLineExt", "fax"].includes(f.key)
      ),
      "Online & Location": userFields.filter((f) =>
        ["website", "address", "websiteIcon", "locationIcon"].includes(f.key)
      ),
    };
  };

  const getCurrentFields = (): FieldDefinition[] => {
    return fieldDefinitions[selectedTemplateType] as FieldDefinition[];
  };

  const handleAddCustomField = () => {
    if (!newFieldForm.key.trim() || !newFieldForm.label.trim()) {
      alert("Please enter both field key and label");
      return;
    }

    // Check if key already exists
    const allFields = [...getCurrentFields(), ...customFields];
    if (allFields.some((field) => field.key === newFieldForm.key)) {
      alert("Field key already exists. Please use a unique key.");
      return;
    }

    const newField: FieldDefinition = {
      key: newFieldForm.key,
      label: newFieldForm.label,
      placeholder: newFieldForm.placeholder || newFieldForm.label,
      type: newFieldForm.type,
      defaultStyle: {
        fontFamily: "Inter, ui-sans-serif",
        fontSize: newFieldForm.fontSize,
        color: newFieldForm.color,
        weight: newFieldForm.weight,
      },
      defaultSize: { w: newFieldForm.width, h: newFieldForm.height },
      ...(newFieldForm.type === "icon" && { defaultIcon: null }),
    };

    setCustomFields([...customFields, newField]);
    setNewFieldForm({
      key: "",
      label: "",
      placeholder: "",
      type: "text",
      fontSize: 13,
      color: "#000000",
      weight: "normal",
      width: 150,
      height: 25,
    });
    setShowCustomFieldForm(false);
  };

  const handleDeleteCustomField = (fieldKey: string) => {
    setCustomFields(customFields.filter((field) => field.key !== fieldKey));
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Fields
        </h3>

        {/* Template Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Type:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTemplateType("userBased")}
              className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                selectedTemplateType === "userBased"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              User Based
            </button>
            <button
              onClick={() => setSelectedTemplateType("companyBased")}
              className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                selectedTemplateType === "companyBased"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Company Based
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Drag fields from below to place them on the canvas.
        </div>
      </div>

      {/* Predefined Fields */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          {selectedTemplateType === "userBased"
            ? "User Based Fields"
            : "Company Based Fields"}
        </h4>

        {selectedTemplateType === "userBased" ? (
          // Organized user fields with collapsible sections
          <div className="space-y-3">
            {Object.entries(getUserFieldGroups()).map(([groupName, fields]) => (
              <div
                key={groupName}
                className="border border-gray-200 rounded-lg"
              >
                <button
                  onClick={() => toggleSection(groupName)}
                  className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between transition-colors"
                >
                  <span>
                    {groupName} ({fields.length})
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      collapsedSections[groupName] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {!collapsedSections[groupName] && (
                  <div className="p-2 space-y-1 bg-white rounded-b-lg">
                    {fields.map((field) => (
                      <DraggableField
                        key={field.key}
                        field={field}
                        onDragStart={onDragStart}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Simple list for company fields (fewer items)
          <div className="space-y-2">
            {getCurrentFields().map((field) => (
              <DraggableField
                key={field.key}
                field={field}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Fields Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Custom Fields ({customFields.length})
          </h4>
          <button
            onClick={() => setShowCustomFieldForm(!showCustomFieldForm)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Field
          </button>
        </div>

        {/* Custom Field Form */}
        {showCustomFieldForm && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Field Key *
                  </label>
                  <input
                    type="text"
                    value={newFieldForm.key}
                    onChange={(e) =>
                      setNewFieldForm({ ...newFieldForm, key: e.target.value })
                    }
                    placeholder="e.g., customField1"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={newFieldForm.label}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        label: e.target.value,
                      })
                    }
                    placeholder="e.g., Custom Field"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={newFieldForm.placeholder}
                  onChange={(e) =>
                    setNewFieldForm({
                      ...newFieldForm,
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="Default text to show"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newFieldForm.type}
                    onChange={(e) =>
                      setNewFieldForm({ ...newFieldForm, type: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <input
                    type="number"
                    value={newFieldForm.fontSize}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        fontSize: parseInt(e.target.value),
                      })
                    }
                    min="8"
                    max="32"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newFieldForm.color}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        color: e.target.value,
                      })
                    }
                    className="w-full h-7 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <select
                    value={newFieldForm.weight}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        weight: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={newFieldForm.width}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        width: parseInt(e.target.value),
                      })
                    }
                    min="50"
                    max="400"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={newFieldForm.height}
                    onChange={(e) =>
                      setNewFieldForm({
                        ...newFieldForm,
                        height: parseInt(e.target.value),
                      })
                    }
                    min="20"
                    max="200"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCustomFieldForm(false)}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomField}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Add Field
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Fields List */}
        <div className="space-y-2">
          {customFields.map((field) => (
            <div key={field.key} className="relative group">
              <DraggableField field={field} onDragStart={onDragStart} />
              <button
                onClick={() => handleDeleteCustomField(field.key)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                title="Delete custom field"
              >
                ×
              </button>
            </div>
          ))}
          {customFields.length === 0 && (
            <div className="text-xs text-gray-500 italic text-center py-2">
              No custom fields added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableFieldSidebar;
