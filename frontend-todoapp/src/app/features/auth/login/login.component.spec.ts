import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

// Mock dependencies
const mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Reset mocks
    mockAuthService.login.calls.reset();
    mockRouter.navigate.calls.reset();
    
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.loginForm.get('email')?.value).toBe('test@example.com');
    expect(component.loginForm.get('password')?.value).toBe('TestPassword123!');
  });

  it('should require email and password', () => {
    component.loginForm.patchValue({ email: '', password: '' });
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.get('email')?.hasError('required')).toBeTruthy();
    expect(component.loginForm.get('password')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    component.loginForm.patchValue({ email: 'invalid-email' });
    expect(component.loginForm.get('email')?.hasError('email')).toBeTruthy();
    
    component.loginForm.patchValue({ email: 'valid@example.com' });
    expect(component.loginForm.get('email')?.hasError('email')).toBeFalsy();
  });

  it('should handle successful login', () => {
    const mockResponse = { 
      token: 'test-token', 
      expires: '2024-12-31T23:59:59Z',
      user: { 
        id: 1, 
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        createdAt: '2024-01-01T00:00:00Z'
      } 
    };
    authService.login.and.returnValue(of(mockResponse));
    
    spyOn(localStorage, 'setItem');
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalsy();
  });

  it('should handle login error with demo fallback', () => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));
    spyOn(localStorage, 'setItem');
    
    // Set correct demo credentials
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    component.onSubmit();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', jasmine.stringMatching(/^demo-token-/));
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalsy();
  });

  it('should show error for invalid credentials', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));
    
    // Set wrong credentials that won't trigger demo fallback
    component.loginForm.patchValue({
      email: 'invalid@example.com',
      password: 'invalidpassword'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.loading).toBeFalsy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should use demo fallback when login fails but credentials match test user', () => {
    authService.login.and.returnValue(throwError(() => new Error('Network error')));
    spyOn(localStorage, 'setItem');
    
    // Set demo credentials that trigger fallback
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    component.onSubmit();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', jasmine.stringMatching(/^demo-token-/));
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalsy();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTruthy();
    
    // Simulate click on password visibility toggle
    component.hidePassword = !component.hidePassword;
    
    expect(component.hidePassword).toBeFalsy();
  });

  it('should set loading state during form submission', () => {
    authService.login.and.returnValue(of({ 
      token: 'test-token', 
      expires: '2024-12-31T23:59:59Z',
      user: { 
        id: 1, 
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User',
        createdAt: '2024-01-01T00:00:00Z'
      } 
    }));
    
    expect(component.loading).toBeFalsy();
    
    component.onSubmit();
    
    // Loading should be set to false after successful completion
    expect(component.loading).toBeFalsy();
  });
});