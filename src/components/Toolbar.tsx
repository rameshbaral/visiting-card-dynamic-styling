import React, { useState } from "react";
import type { RefObject } from "react";
import { useCardStore } from "../store/useCardStore";
import { downloadAsPNG, downloadAsPDF } from "../utils/download";

interface ToolbarProps {
  canvasRef: RefObject<HTMLDivElement | null>;
}

const Toolbar: React.FC<ToolbarProps> = ({ canvasRef }) => {
  const { resetFields, saveDesign, savedDesigns, loadDesign, deleteDesign } =
    useCardStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const handleDownloadPNG = async () => {
    if (canvasRef.current) {
      await downloadAsPNG(canvasRef.current);
    }
  };

  const handleDownloadPDF = async () => {
    if (canvasRef.current) {
      await downloadAsPDF(canvasRef.current);
    }
  };

  const handleSave = () => {
    if (saveName.trim()) {
      saveDesign(saveName.trim());
      setSaveName("");
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (name: string) => {
    loadDesign(name);
    setShowLoadDialog(false);
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteDesign(name);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPNG}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Download PDF
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Save Design
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Load Design
          </button>
        </div>

        <button
          onClick={resetFields}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Reset Fields
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Design</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter design name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Load Design</h3>
            {savedDesigns.length === 0 ? (
              <p className="text-gray-500 mb-4">No saved designs found.</p>
            ) : (
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {savedDesigns.map((design) => (
                  <div
                    key={design.name}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">{design.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoad(design.name)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(design.name)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowLoadDialog(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
