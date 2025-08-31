import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export const downloadAsPNG = async (
  element: HTMLElement,
  filename: string = "business-card.png"
) => {
  try {
    const dataUrl = await toPng(element, {
      width: 643,
      height: 383,
      pixelRatio: 2,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};

export const downloadAsPDF = async (
  element: HTMLElement,
  filename: string = "business-card.pdf"
) => {
  try {
    const dataUrl = await toPng(element, {
      width: 643,
      height: 383,
      pixelRatio: 2,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 297; // A4 width in mm
    const imgHeight = (383 * imgWidth) / 643; // Maintain aspect ratio
    const x = (297 - imgWidth) / 2; // Center horizontally
    const y = (210 - imgHeight) / 2; // Center vertically

    pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
