import React from "react";
import { useCardStore } from "../store/useCardStore";
import type { FieldKey } from "../types";

const FieldEditor: React.FC = () => {
  const { fields, setField, setLogo } = useCardStore();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fieldConfigs: Array<{
    key: FieldKey;
    label: string;
    placeholder: string;
  }> = [
    { key: "firstName", label: "First Name", placeholder: "Enter first name" },
    { key: "lastName", label: "Last Name", placeholder: "Enter last name" },
    { key: "occupation", label: "Occupation", placeholder: "Enter occupation" },
    { key: "company", label: "Company", placeholder: "Enter company name" },
    { key: "mobile", label: "Mobile", placeholder: "Enter mobile number" },
    { key: "email", label: "Email", placeholder: "Enter email address" },
    {
      key: "landline",
      label: "Landline",
      placeholder: "Enter landline number",
    },
    { key: "fax", label: "Fax", placeholder: "Enter fax number" },
    { key: "address", label: "Address", placeholder: "Enter address" },
    { key: "website", label: "Website", placeholder: "Enter website URL" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Card Details</h3>

      <div className="space-y-4">
        {fieldConfigs.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            {key === "address" ? (
              <textarea
                value={fields[key] || ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={fields[key] || ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {fields.logo && (
            <p className="text-xs text-gray-500 mt-1">
              Logo uploaded successfully
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
