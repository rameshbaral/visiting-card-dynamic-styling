import React, { useState } from "react";
import {
  iconCategories,
  IconDisplay,
  type IconDefinition,
} from "./IconLibrary";

interface IconSelectorProps {
  selectedIcon?: IconDefinition | null;
  onIconSelect: (icon: IconDefinition | null) => void;
  onClose: () => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("contact");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { key: "contact", name: "Contact", icon: "📞" },
    { key: "social", name: "Social", icon: "🌐" },
    { key: "business", name: "Business", icon: "💼" },
    { key: "technology", name: "Technology", icon: "💻" },
    { key: "creative", name: "Creative", icon: "🎨" },
    { key: "service", name: "Service", icon: "🛠️" },
    { key: "transportation", name: "Transportation", icon: "🚗" },
  ];

  const getFilteredIcons = () => {
    const categoryIcons =
      iconCategories[activeCategory as keyof typeof iconCategories] || [];

    if (!searchTerm) return categoryIcons;

    return categoryIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <button
              onClick={() => onIconSelect(null)}
              className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg transition-colors ${
                !selectedIcon
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-500 hover:border-gray-400"
              }`}
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              No Icon
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {getFilteredIcons().map((icon) => (
              <button
                key={icon.id}
                onClick={() => onIconSelect(icon)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedIcon?.id === icon.id
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
                title={icon.name}
              >
                <IconDisplay icon={icon} size={24} />
              </button>
            ))}
          </div>

          {getFilteredIcons().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.674"
                />
              </svg>
              <p>No icons found</p>
              <p className="text-sm">Try a different search term or category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
