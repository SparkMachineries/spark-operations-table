# Project Structure

## Root Directory

```
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
├── node_modules/           # Dependencies
├── package.json            # Project configuration
├── vite.config.js          # Vite build configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # Project documentation
```

## Source Code Organization (`src/`)

### Core Application Files

- `main.jsx` - Application entry point
- `App.jsx` - Main application component with routing
- `index.css` - Global styles
- `App.css` - Component-specific styles

### Authentication & Context

- `authContext.jsx` - Authentication context provider
- `firebase.js` - Firebase configuration and initialization

### Services

- `firestoreService.js` - Firebase Firestore operations and data access layer

### Components (`src/components/`)

All React components are organized in a flat structure:

#### Layout Components

- `Header.jsx` - Top navigation header
- `Sidebar.jsx` - Navigation sidebar
- `LoginPage.jsx` - Authentication page

#### Core Views

- `Dashboard.jsx` - Main dashboard with analytics
- `TableView.jsx` - Booking data table view
- `MonthlyPassView.jsx` - Monthly pass management

#### Utility Components

- `ProtectedRoute.jsx` - Route authentication wrapper
- `FilterBar.jsx` - Data filtering controls
- `TableFilters.jsx` - Table-specific filters
- `StatusCard.jsx` - Dashboard status cards
- `DeleteModal.jsx` - Confirmation modal
- `Toast.jsx` - Notification component

## Architectural Patterns

### Component Structure

- Functional components with React hooks
- Props-based data flow
- Context API for global state (authentication)
- Service layer for data operations

### Routing Structure

- `/` - Dashboard (protected)
- `/table` - Table view (protected)
- `/monthly-passes` - Monthly pass management (protected)
- `/login` - Authentication page
- `*` - Catch-all redirects to dashboard

### Data Flow

1. `App.jsx` fetches data using `firestoreService.js`
2. Data passed down through props to child components
3. Authentication state managed through `AuthContext`
4. Firebase operations abstracted in service layer

### File Naming Conventions

- React components: PascalCase with `.jsx` extension
- Service files: camelCase with `.js` extension
- Configuration files: lowercase with appropriate extensions
- All components are in flat structure under `src/components/`
