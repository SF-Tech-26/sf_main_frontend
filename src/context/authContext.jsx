import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

// Decode JWT token to extract user info
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load token and user from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
            const decoded = decodeToken(storedToken);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setToken(storedToken);
                // Use stored user data if available, otherwise use decoded token
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        setUser(decoded);
                    }
                } else {
                    setUser(decoded);
                }
            } else {
                // Token expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken, userData = null) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);

        if (userData) {
            // Store full user data from API response
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            // Fallback to decoded token
            const decoded = decodeToken(newToken);
            setUser(decoded);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await api.post('/user/changePassword', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ token, user, isLoading, isAuthenticated, login, logout, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

