import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const isActiveRoute = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex items-center">
                                <span className="text-xl font-bold text-blue-600">Twitter</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActiveRoute('/') 
                                        ? 'text-blue-600 bg-blue-50' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/create-post"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActiveRoute('/create-post')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Créer un post
                            </Link>
                            <Link
                                to="/profile"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    location.pathname.startsWith('/profile')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Profil
                            </Link>
                            <Link
                                to="/media"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActiveRoute('/media')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Médias
                            </Link>
                            <Link
                                to="/login"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    isActiveRoute('/login')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-16">
                <main className="max-w-7xl mx-auto px-4 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}; 