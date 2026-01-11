import api from './api';

/**
 * Login user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} API response with token and user data
 */
export const loginUser = async (email, password) => {
    const response = await api.post('/user/login', { email, password });
    return response.data;
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} API response
 */
export const registerUser = async (userData) => {
    const response = await api.post('/user/register_user', userData);
    return response.data;
};

/**
 * Login with Google OAuth token
 * @param {string} token - Google OAuth token
 * @returns {Promise} API response with token and user data
 */
export const googleLogin = async (token) => {
    const response = await api.post('/user/login/google', { token });
    return response.data;
};

/**
 * Change user password
 * @param {string} token - Auth token
 * @param {string} email - User email
 * @param {string} password - New password
 * @returns {Promise} API response
 */
export const changePassword = async (token, email, password) => {
    const response = await api.post('/user/changePassword', { token, email, password });
    return response.data;
};
