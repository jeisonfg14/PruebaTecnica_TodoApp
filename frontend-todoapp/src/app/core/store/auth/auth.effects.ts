import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse, User } from '../../models';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AuthEffects constructor', { actions$: this.actions$, authService: this.authService, router: this.router });
  }

  // Temporarily commenting out all effects to debug
  // login$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.login),
  //     exhaustMap(action =>
  //       this.authService.login(action.credentials).pipe(
  //         map((authResponse: AuthResponse) => {
  //           // Store token in localStorage
  //           localStorage.setItem('token', authResponse.token);
  //           return AuthActions.loginSuccess({ authResponse });
  //         }),
  //         catchError(error => of(AuthActions.loginFailure({ error: error.message || 'Login failed' })))
  //       )
  //     )
  //   )
  // );

  // register$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.register),
  //     exhaustMap(action =>
  //       this.authService.register(action.userData).pipe(
  //         map((authResponse: AuthResponse) => {
  //           // Store token in localStorage
  //           localStorage.setItem('token', authResponse.token);
  //           return AuthActions.registerSuccess({ authResponse });
  //         }),
  //         catchError(error => of(AuthActions.registerFailure({ error: error.message || 'Registration failed' })))
  //       )
  //     )
  //   )
  // );

  // loadCurrentUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.loadCurrentUser),
  //     exhaustMap(() =>
  //       this.authService.getCurrentUser().pipe(
  //         map((user: User) => AuthActions.loadCurrentUserSuccess({ user })),
  //         catchError(error => {
  //           // If loading current user fails, logout
  //           this.router.navigate(['/auth/login']);
  //           localStorage.removeItem('token');
  //           return of(AuthActions.logout());
  //         })
  //       )
  //     )
  //   )
  // );

  // loginSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
  //     tap(() => {
  //       this.router.navigate(['/dashboard']);
  //     })
  //   ),
  //   { dispatch: false }
  // );

  // logout$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.logout),
  //     tap(() => {
  //       // Remove token from localStorage
  //       localStorage.removeItem('token');
  //       this.router.navigate(['/auth/login']);
  //     })
  //   ),
  //   { dispatch: false }
  // );

  // authError$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.loadCurrentUserFailure),
  //     tap(action => {
  //       // If token is invalid, remove it and redirect to login
  //       if (action.error.includes('401') || action.error.includes('Unauthorized')) {
  //         localStorage.removeItem('token');
  //         this.router.navigate(['/auth/login']);
  //       }
  //     })
  //   ),
  //   { dispatch: false }
  // );
}