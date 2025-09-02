# Canvas Export Functionality - Manual Test

## Test Steps to Verify Export Canvas Fix

### Prerequisites

1. Start the development server: `npm run dev`
2. Navigate to the application
3. Click on "Template Designer" button in the header

### Test Case 1: Export Buttons Visibility

1. **Expected**: You should see three export buttons in the header:
   - "Export PNG" (Green button)
   - "Export PDF" (Purple button)
   - "Export Template" (Blue button)

### Test Case 2: Export Buttons Initial State

1. **Expected**: PNG and PDF export buttons should be disabled initially (when no fields are placed)
2. **Expected**: Export Template button should be disabled initially (when no template name is entered)

### Test Case 3: Enable Export After Adding Fields

1. Drag a field from the left sidebar (e.g., "First Name") to the canvas
2. **Expected**: PNG and PDF export buttons should now be enabled
3. **Expected**: Canvas should show the dropped field

### Test Case 4: PNG Export Functionality

1. Ensure at least one field is placed on canvas
2. Click "Export PNG" button
3. **Expected**: Browser should download a PNG file named "template-preview.png"
4. **Expected**: The PNG should contain the canvas with the placed fields and background

### Test Case 5: PDF Export Functionality

1. Enter a template name in the input field (e.g., "My Test Template")
2. Ensure at least one field is placed on canvas
3. Click "Export PDF" button
4. **Expected**: Browser should download a PDF file named "mytesttemplate-preview.pdf"
5. **Expected**: The PDF should contain the canvas with the placed fields and background

### Test Case 6: Export with Background Image

1. Select a background image from the Background selector in the left sidebar
2. Add some fields to the canvas
3. Click "Export PNG" button
4. **Expected**: The exported image should include the background image

### Test Case 7: Export Canvas Data Attribute

1. Open browser developer tools
2. Inspect the canvas element
3. **Expected**: The canvas div should have a `data-canvas-export` attribute

## Expected Results

- ✅ All export buttons are visible and properly labeled
- ✅ Export buttons are disabled/enabled based on canvas content
- ✅ PNG export generates and downloads a PNG file
- ✅ PDF export generates and downloads a PDF file
- ✅ Export file names include template name when provided
- ✅ Exported images include background and field content
- ✅ Canvas element has proper data attribute for export targeting

## Common Issues and Solutions

- **Export buttons not working**: Check browser console for errors
- **Files not downloading**: Check browser download permissions
- **Empty exports**: Ensure canvas has content and proper data attribute
- **Poor quality exports**: Check if html-to-image library is properly configured

## Technical Implementation Details

- Uses `html-to-image` library for PNG export
- Uses `jsPDF` library for PDF export
- Canvas is targeted via `[data-canvas-export]` selector
- Export functions are in `src/utils/download.ts`
- Canvas reference is passed through React useRef hook

