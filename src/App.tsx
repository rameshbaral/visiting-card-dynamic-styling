import { useRef, useState } from "react";
import CardCanvas from "./components/CardCanvas";
import TemplatePicker from "./components/TemplatePicker";
import Toolbar from "./components/Toolbar";
import CanvasDesigner from "./components/designer/CanvasDesigner";
import { useCardStore } from "./store/useCardStore";
import "./App.css";

type ViewMode = "editor" | "designer";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentTemplate, setLogo } = useCardStore();
  const [currentView, setCurrentView] = useState<ViewMode>("editor");

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

  // If designer view is selected, show the designer component
  if (currentView === "designer") {
    return (
      <CanvasDesigner onNavigateToEditor={() => setCurrentView("editor")} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Visiting Card Designer
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("editor")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (currentView as string) === "editor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Card Editor
              </button>
              <button
                onClick={() => setCurrentView("designer")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (currentView as string) === "designer"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Template Designer
              </button>
              <div className="text-sm text-gray-500">
                Template: {currentTemplate.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Card Canvas */}
          <div className="lg:col-span-2">
            <CardCanvas canvasRef={canvasRef} />
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Save Button */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <button
                onClick={() => {
                  const name = prompt("Enter a name for your design:");
                  if (name) {
                    useCardStore.getState().saveDesign(name);
                  }
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>

            {/* Logo Upload */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Template Picker */}
            <TemplatePicker />

            {/* Toolbar */}
            <Toolbar canvasRef={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
