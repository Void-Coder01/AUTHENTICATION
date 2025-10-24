import { create } from 'zustand';
import axios from 'axios';
import ForgotPassword from '../pages/ForgotPassword';

const API_KEY = "http://localhost:5000/api/auth" 

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user:null,
    isAuthenticated : false,
    error: null,
    isLoading:false,
    isCheckingAuth:true,
    message : null,

    signup: async(email, password, name) => {
        set({isLoading : true, error: null});
        try {
            const response = await axios.post(`${API_KEY}/signup`,{email,password,name});
            set({isLoading : false, user : response.data.user, isAuthenticated:true})
        } catch (error) {
            
            set({error : error.response.data.msg || "error in signing up",isLoading: false});
            throw error;
        }
    },

    login : async (email, password) => {
        set({isLoading : true, error : null})

        try {
            const response = await axios.post(`${API_KEY}/login`, {email, password});
            set({
                error : null,
                isAuthenticated : true,
                isLoading : false,
                user : response.data.user
            })
            
        } catch (error) {
            set({
                error : error.response?.data?.msg || "error in login",
                isLoading : false
            })

            throw error
        }
    },

    logout : async() => { 
        set({isLoading : true, error: null})
        try {
            await axios.post(`${API_KEY}/logout`);
            set({isLoading : false, isAuthenticated:false, error : null, user:null})
        } catch (error) {
            set({error : "error in logging out", isLoading : false})
            throw error;
        }
    },

    verifyEmail : async(code) => {
        set({isLoading : true, error:null})

        try {
            const response = await axios.post(`${API_KEY}/verify-email`, {code});
            set({user: response.data.user, isLoading : false})
        } catch (error) {
            set({isLoading : false, error : error.response.data.msg || "error in verify email"})
            throw error;
        }
    },

    checkAuth : async() => {
        set({isCheckingAuth : true, error : null})

        try {
            const response = await axios.get(`${API_KEY}/check-auth`,)
            set({user : response.data.user, isCheckingAuth : false, isAuthenticated : true })
        } catch (error) {
            set({isAuthenticated : false, isCheckingAuth : false, error : null})//age idr error m kuch dalega toh signup page m dikhega 
        }       
    },

    forgotPassword : async(email) => {
        set({isLoading : true, error : null})

        try {
            const response = await axios.post(`${API_KEY}/forgot-password`, {email});
            set({isLoading : false, message : response.data.msg})
        } catch (error) {
            set({
                isLoading : false,
                error: error.response.data.message || "Error sending reset password email",
            })
            throw error;
        }
    },
    resetPassword : async(token,password) => {
        set({isLoading : true, error : null})

        try {
            const res = await axios.post(`${API_KEY}/reset-password/${token}`, {password});
            set({isLoading : false, message : res.data.msg})
        } catch (error) {
            set({isLoading : false, error : error.response.data.message || "error in resetting password"});
            throw error
        }
    }
})) 

