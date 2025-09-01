# CPU Exam Schedule Finder - Client Application

The student-facing React frontend for the CPU Exam Schedule Finder.

**Live Site:** [cpuexamfinder.vercel.app](https://cpuexamfinder.vercel.app)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Setup

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000
```

For production (Vercel), set:
```env
VITE_API_URL=https://your-api-server.render.com
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                # Reusable UI components
│       ├── SearchForm.tsx        # Main search form
│       ├── ExamResults.tsx       # Results display
│       ├── DisclaimerSection.tsx # App disclaimer
│       ├── Footer.tsx            # Footer component
│       └── CustomSelect.tsx      # Custom dropdown component
├── pages/
│   ├── Index.tsx              # Main application page
│   ├── DatabaseDown.tsx       # Database error page
│   └── NoActiveExamPeriod.tsx # No active exam period page
├── services/
│   └── api.ts                 # API service functions
├── types/
│   └── exam.ts               # TypeScript type definitions
├── config/
│   └── defaults.ts           # Default configuration values
├── App.tsx                   # Root component
└── main.tsx                  # Application entry point
```

## 🎨 Design System

- **Colors:** CPU Blue (#1e3a8a), CPU Gold (#facc15), CPU Beige
- **Typography:** Consolas monospace font family
- **Icons:** Lucide React
- **Styling:** Tailwind CSS 4 with custom utilities
- **Responsive:** Mobile-first design approach

## 📱 Key Features

- **Smart Search Form** - Flexible search with required subject code
- **Real-time Validation** - Form validation with user-friendly error messages
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Error State Management** - Handles database down vs no results scenarios
- **Toast Notifications** - User feedback using Sonner library
- **CPU Branding** - Custom styling matching university identity

## 🌐 Deployment (Vercel)

1. **Connect to GitHub** - Link your repository to Vercel
2. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-api-server.render.com
   ```
3. **Deploy** - Automatic deployments on git push to main branch

### Build Configuration
The project uses Vite with TypeScript compilation. Build output goes to `dist/` directory.

## 🔌 API Integration

The client communicates with the backend API through the `ApiService` class:

- `getActiveExamPeriod()` - Fetch current exam period information
- `searchExamSchedule(params)` - Search for exam schedules with filters

API calls include proper error handling with specific error types for different scenarios.

## 🛠️ Development Notes

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency rules
- **Hot Reload** - Instant updates during development
- **Build Optimization** - Tree shaking and code splitting enabled
- **Environment Variables** - Vite's `import.meta.env` for configuration

## 🧪 Testing

Currently no automated tests implemented. Manual testing covers:
- Search functionality with various input combinations
- Responsive design across different screen sizes
- Error states and edge cases
- Form validation and user feedback

## 📦 Dependencies

**Main Dependencies:**
- React 19 - UI framework
- TypeScript - Type safety
- Tailwind CSS 4 - Styling
- Lucide React - Icons
- Sonner - Toast notifications
- date-fns - Date formatting utilities
- clsx - Conditional CSS classes

**Dev Dependencies:**
- Vite - Build tool
- ESLint - Code linting
- TypeScript compiler - Type checking
