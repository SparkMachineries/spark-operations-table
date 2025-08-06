# Technology Stack

## Frontend Framework

- **React 19.1.0** with functional components and hooks
- **Vite 6.3.5** as build tool and development server
- **React Router DOM 7.5.3** for client-side routing

## Styling & UI

- **Tailwind CSS 4.1.7** for utility-first styling
- **Tailwind Vite Plugin** for integrated CSS processing
- Mobile-first responsive design approach

## Backend & Database

- **Firebase Firestore** for real-time database operations
- **Firebase SDK 11.7.1** for backend services
- Collections: `bookings`, `monthly_passes`

## Key Libraries

- **Recharts 2.15.3** - Charts and data visualization
- **React DatePicker 8.3.0** - Date selection components
- **XLSX 0.18.5** - Excel file generation and export
- **File-saver 2.0.5** - Client-side file downloads

## Development Tools

- **ESLint 9.25.0** with React-specific rules
- **Vite React Plugin** for fast refresh and development

## Common Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
```

### Project Structure

- ES6 modules with `.jsx` extensions for React components
- Functional components with hooks pattern
- Context API for state management (AuthContext)
- Service layer pattern for Firebase operations (`firestoreService.js`)

## Build Configuration

- Vite configuration includes React and Tailwind plugins
- ESLint configured for React hooks and refresh patterns
- Modern JavaScript (ES2020) with browser globals
