# Visiting Card Designer

A modern, interactive web application for creating professional visiting cards with real-time editing capabilities, multiple templates, and export functionality.

![Visiting Card Designer](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.2-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-cyan)

## ✨ Features

### 🎨 Design System

- **Template-Based Design**: Pre-designed templates with professional layouts
- **Real-Time Editing**: Click-to-edit functionality with live preview
- **Coordinate-Based Positioning**: Precise pixel-perfect element placement
- **Typography Control**: Complete font styling and positioning control

### 🖼️ Visual Elements

- **Background Images**: Support for custom background patterns and images
- **Logo Integration**: Easy logo upload and positioning
- **Shape System**: Rectangles, polygons, and decorative elements
- **Responsive Canvas**: Maintains aspect ratio across devices

### 💾 Data Management

- **Auto-Save**: Automatic saving of design progress
- **Template Library**: Multiple professional templates to choose from
- **Export Options**: PNG, JPG, and PDF export capabilities
- **Local Storage**: Persistent storage using Zustand with localStorage

### 🛠️ Developer Features

- **TypeScript**: Full type safety with comprehensive interfaces
- **Component Architecture**: Modular React components
- **State Management**: Zustand for efficient state handling
- **Hot Reload**: Vite-powered development experience

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/visiting-card-designer.git
   cd visiting-card-designer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build production-ready application       |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint for code quality checks       |

## 🏗️ Project Structure

```
visiting-card-designer/
├── public/
│   ├── card-background-images/     # Template background images
│   └── vite.svg                    # App icon
├── src/
│   ├── components/                 # React components
│   │   ├── CardCanvas.tsx         # Main canvas component
│   │   ├── FieldEditor.tsx        # Form-based field editor
│   │   ├── TemplatePicker.tsx     # Template selection UI
│   │   └── Toolbar.tsx            # Action buttons and tools
│   ├── store/
│   │   └── useCardStore.ts        # Zustand state management
│   ├── templates/                 # Template configurations
│   │   ├── blueGray.json         # Template definitions
│   │   ├── modernSimple.json
│   │   ├── pinkBlue.json
│   │   └── index.ts              # Template exports
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── download.ts           # Export utilities
│   ├── App.tsx                   # Main application component
│   ├── App.css                   # Application styles
│   ├── index.css                 # Global styles
│   └── main.tsx                  # Application entry point
├── STYLING_SYSTEM_DOCUMENTATION.md # Complete styling guide
└── README.md                     # This file
```

## 🎯 Usage Guide

### Creating a New Card

1. **Choose a Template**

   - Browse available templates in the right panel
   - Click on any template to select it
   - Templates automatically load with default styling

2. **Edit Content**

   - Click on any field in the canvas to edit text
   - Use the field editor panel for form-based editing
   - Fields support different input types (text, textarea, file upload)

3. **Upload Logo**

   - Use the logo upload button in the toolbar
   - Supports PNG, JPG, and SVG formats
   - Logo automatically fits within designated area

4. **Export Your Card**
   - Click the export button in the toolbar
   - Choose from PNG, JPG, or PDF formats
   - Download starts automatically

### Field Types

| Field Type     | Description           | Special Features                       |
| -------------- | --------------------- | -------------------------------------- |
| **firstName**  | Primary name field    | Bold typography, prominent positioning |
| **lastName**   | Secondary name field  | Bold typography, pairs with firstName  |
| **occupation** | Job title/role        | Medium typography, spans wider area    |
| **mobile**     | Mobile phone number   | Contact field with validation          |
| **email**      | Email address         | Email format validation                |
| **landline**   | Landline phone        | Contact field                          |
| **fax**        | Fax number            | Contact field                          |
| **address**    | Physical address      | Multiline textarea support             |
| **company**    | Company name          | Medium typography                      |
| **website**    | Website URL           | URL format handling                    |
| **logo**       | Company/personal logo | Image upload and display               |

## 🎨 Template System

### Template Structure

Templates are JSON-based configurations that define:

```typescript
interface TemplateDesign {
  id: string; // Unique identifier
  name: string; // Display name
  size: { width: number; height: number }; // Canvas dimensions (643×383px)
  background: { color?: string } | null; // Background color
  shapes: Shape[]; // Background elements and decorations
  fields: FieldSpec[]; // Text field definitions with positioning
  defaults?: Record<string, string>; // Default field values
}
```

### Creating Custom Templates

1. **Define Canvas Size** (Standard: 643×383px)
2. **Set Background** (Color or image)
3. **Add Shapes** (Decorative elements)
4. **Position Fields** (Text input areas)
5. **Configure Styling** (Typography and colors)

See [STYLING_SYSTEM_DOCUMENTATION.md](./STYLING_SYSTEM_DOCUMENTATION.md) for detailed template creation guide.

### Available Templates

- **Modern Simple**: Clean, minimalist design
- **Blue Gray**: Professional corporate style
- **Pink Blue**: Creative and colorful layout

## 🔧 Technical Details

### Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: TailwindCSS 4.1.12
- **State Management**: Zustand 5.0.8
- **Build Tool**: Vite 7.1.2
- **Export**: html-to-image + jsPDF

### Key Dependencies

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "zustand": "^5.0.8",
  "html-to-image": "^1.11.13",
  "jspdf": "^3.0.2",
  "tailwindcss": "^4.1.12"
}
```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Canvas Specifications

- **Dimensions**: 643px × 383px (business card proportions)
- **Coordinate System**: Top-left origin (0,0)
- **Units**: Pixels for all measurements
- **Rendering**: HTML/CSS with absolute positioning

## 🎨 Styling System

### Typography Hierarchy

| Level       | Font Size | Weight  | Usage                       |
| ----------- | --------- | ------- | --------------------------- |
| **Level 1** | 20px      | Bold    | Names (firstName, lastName) |
| **Level 2** | 16px      | Regular | Job title, occupation       |
| **Level 3** | 13px      | Regular | Contact information         |
| **Level 4** | 8px       | Regular | Helper text, placeholders   |

### Color Scheme

- **Primary Text**: `#000000` (Black)
- **Helper Text**: `#6B7280` (Gray)
- **Background**: `#FFFFFF` (White, customizable)

### Font Family

Default: `"Inter, ui-sans-serif"`

- Clean, modern typeface
- Excellent readability
- System fallbacks included

## 📊 Layout Patterns

### Two-Column Layout

```
[First Name ] [Last Name  ]
[Occupation across both   ]
[Contact 1  ] [Contact 2  ]
[Address    ] [Company    ] [Logo]
```

### Single-Column Layout

```
[Full Name           ]
[Occupation          ]
[Contact Information ]
[Address             ] [Logo]
[Company             ]
```

## 🔐 Security & Validation

### Input Validation

- **Text Fields**: 50 character limit, HTML sanitization
- **Email**: RFC 5322 format validation
- **Phone**: International format support
- **File Upload**: Type validation, size limits (5MB)

### Data Protection

- Client-side only processing
- No sensitive data transmission
- Local storage for user preferences
- Secure file handling

## 🚀 Performance

### Optimization Features

- **Virtual DOM**: Efficient re-rendering
- **Debounced Updates**: Smooth real-time editing
- **Image Caching**: Optimized asset loading
- **Code Splitting**: Lazy loading for large templates

### Bundle Size

- **Gzipped**: ~150KB
- **Tree Shaking**: Unused code elimination
- **Modern Build**: ES2020+ targets

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_APP_TITLE=Visiting Card Designer
VITE_API_BASE_URL=http://localhost:3001
VITE_CDN_URL=https://cdn.example.com
```

### Customization Options

1. **Templates**: Add new JSON templates to `src/templates/`
2. **Styling**: Modify TailwindCSS configuration
3. **Fields**: Extend field types in `src/types/index.ts`
4. **Export**: Customize export formats in `src/utils/download.ts`

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Visual regression tests
npm run test:visual
```

### Test Coverage

- Component rendering tests
- Template validation tests
- Export functionality tests
- User interaction tests

## 🚀 Deployment

### Static Hosting

The application builds to static files and can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Build and deploy `dist/` folder
- **AWS S3**: Upload `dist/` to S3 bucket

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### CDN Integration

For production, configure CDN for:

- Background images
- Template thumbnails
- Font files
- Static assets

## 🛣️ Roadmap

### Upcoming Features

- [ ] **Template Builder**: Visual template creation tool
- [ ] **Cloud Storage**: Save designs to cloud
- [ ] **Collaboration**: Share and collaborate on designs
- [ ] **Advanced Export**: Vector formats (SVG, EPS)
- [ ] **Print Integration**: Direct printer support
- [ ] **Mobile App**: React Native version

### API Integration

- [ ] **Backend API**: User authentication and storage
- [ ] **Template Store**: Community template sharing
- [ ] **Asset Management**: Cloud image storage
- [ ] **Analytics**: Usage tracking and insights

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Make your changes
6. Run tests: `npm run test`
7. Commit changes: `git commit -m 'Add amazing feature'`
8. Push to branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Coding Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow configuration in `.eslintrc`
- **Prettier**: Code formatting on save
- **Conventional Commits**: Use semantic commit messages

### Pull Request Guidelines

- Include description of changes
- Add tests for new features
- Update documentation if needed
- Ensure all tests pass
- Follow code style guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- **Inter Font** - Beautiful typography by Google Fonts
- **TailwindCSS** - Utility-first CSS framework
- **React Team** - Amazing UI library
- **Vite Team** - Lightning-fast build tool

## 📞 Support

### Documentation

- [Styling System Guide](./STYLING_SYSTEM_DOCUMENTATION.md)
- [API Documentation](./docs/api.md)
- [Component Reference](./docs/components.md)

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/visiting-card-designer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/visiting-card-designer/discussions)
- **Email**: support@example.com

### FAQ

**Q: Can I add custom fonts?**
A: Yes, modify the font family in template configurations or add new fonts via Google Fonts.

**Q: What image formats are supported for backgrounds?**
A: JPG, PNG, and SVG formats are supported for background images.

**Q: Can I create templates with different dimensions?**
A: Currently, templates use standard business card proportions (643×383px), but this can be customized.

**Q: Is there a mobile app?**
A: The web app is responsive and works on mobile browsers. A native app is planned for future releases.

---

<div align="center">

**Made with ❤️ by the Visiting Card Designer Team**

[⭐ Star this repo](https://github.com/yourusername/visiting-card-designer) | [🐛 Report Bug](https://github.com/yourusername/visiting-card-designer/issues) | [✨ Request Feature](https://github.com/yourusername/visiting-card-designer/issues)

</div>
