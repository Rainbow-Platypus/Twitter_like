import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './store/useAuthStore';

// Lazy loading des composants
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const MediaPage = React.lazy(() => import('./pages/MediaPage'));

// Composant de chargement
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

const App: React.FC = () => {
    const checkAuth = useAuthStore(state => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <Layout>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile/:username?"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/create-post"
                            element={
                                <PrivateRoute>
                                    <CreatePost />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/media"
                            element={
                                <PrivateRoute>
                                    <MediaPage />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Suspense>
            </Layout>
        </Router>
    );
};

export default App; 