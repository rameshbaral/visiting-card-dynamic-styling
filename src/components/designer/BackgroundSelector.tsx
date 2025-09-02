import React from "react";

interface BackgroundSelectorProps {
  selectedBackground: string | null;
  onBackgroundSelect: (background: string | null) => void;
}

const backgroundImages = [
  {
    name: "None",
    path: null,
    preview: null,
  },
  {
    name: "Blue Gray",
    path: "/card-background-images/blue-gray.jpg",
    preview: "/card-background-images/blue-gray.jpg",
  },
  {
    name: "Modern Simple",
    path: "/card-background-images/modern-simple.jpg",
    preview: "/card-background-images/modern-simple.jpg",
  },
  {
    name: "Pink Blue",
    path: "/card-background-images/pink-blue.jpg",
    preview: "/card-background-images/pink-blue.jpg",
  },
];

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  selectedBackground,
  onBackgroundSelect,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Background</h3>

      <div className="grid grid-cols-2 gap-3">
        {backgroundImages.map((bg, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
              selectedBackground === bg.path
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onBackgroundSelect(bg.path)}
          >
            <div className="p-2">
              <div
                className="w-full h-20 rounded border bg-gray-100 flex items-center justify-center text-sm text-gray-600 overflow-hidden"
                style={{
                  backgroundImage: bg.preview
                    ? `url(${bg.preview})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!bg.preview && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚫</div>
                    <div className="text-xs">No Background</div>
                  </div>
                )}
              </div>
              <div className="text-center mt-2 text-sm font-medium text-gray-700">
                {bg.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBackground && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Selected:</strong>{" "}
            {
              backgroundImages.find((bg) => bg.path === selectedBackground)
                ?.name
            }
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Background will be applied to the canvas
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector;

