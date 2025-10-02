import { createReducer, on } from '@ngrx/store';
import { User } from '../../models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(AuthActions.loginSuccess, (state, { authResponse }) => ({
    ...state,
    user: authResponse.user,
    token: authResponse.token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error,
  })),
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(AuthActions.registerSuccess, (state, { authResponse }) => ({
    ...state,
    user: authResponse.user,
    token: authResponse.token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error,
  })),
  
  // Logout
  on(AuthActions.logout, () => ({
    ...initialState,
    token: null,
    isAuthenticated: false,
  })),
  
  // Load Current User
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null,
  })),
  
  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error,
  })),
  
  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);