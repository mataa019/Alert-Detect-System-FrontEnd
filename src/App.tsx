import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { HomePage } from './Pages/HomePage';
import { DashboardPage } from './Pages/DashboardPage';
import { CasesPage } from './Pages/CasesPage';
import { TasksPage } from './Pages/TasksPage';
import { CaseDetails } from './components/cases/CaseDetails';
import { CreateCase } from './components/cases/CreateCase';
import { ErrorMessage } from './components/common/ErrorMessage';
import { AuthService } from './services/api';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Login Component with Mock Authentication
const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Mock users for testing
  const mockUsers = [
    { username: 'admin', password: 'admin', role: 'MANAGER', name: 'Admin User' },
    { username: 'investigator', password: 'investigator', role: 'INVESTIGATOR', name: 'John Investigator' },
    { username: 'analyst', password: 'analyst', role: 'ANALYST', name: 'Jane Analyst' },
    { username: 'supervisor', password: 'supervisor', role: 'SUPERVISOR', name: 'Mike Supervisor' },
    { username: 'demo', password: 'demo', role: 'INVESTIGATOR', name: 'Demo User' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check mock credentials
    const user = mockUsers.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      // Mock successful login
      const mockToken = btoa(JSON.stringify({
        username: user.username,
        role: user.role,
        name: user.name,
        exp: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      }));

      AuthService.setToken(mockToken);
      AuthService.setCurrentUser(user);
      
      // Navigate to dashboard
      window.location.href = '/dashboard';
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Alert Detection System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Financial Crime Investigation Platform
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700 font-medium">Demo Credentials:</p>
            <div className="text-xs text-blue-600 mt-2 space-y-1">
              <p><strong>Admin:</strong> admin / admin</p>
              <p><strong>Investigator:</strong> investigator / investigator</p>
              <p><strong>Analyst:</strong> analyst / analyst</p>
              <p><strong>Quick Demo:</strong> demo / demo</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ErrorMessage 
            message="Something went wrong. Please refresh the page or contact support."
            details={this.state.error?.message}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases" element={
              <ProtectedRoute>
                <Layout>
                  <CasesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateCase />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CaseDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <TasksPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect to dashboard by default */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
