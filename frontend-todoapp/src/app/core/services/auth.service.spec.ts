import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockAuthResponse: AuthResponse = {
    token: 'test-jwt-token',
    expires: '2024-12-31T23:59:59Z',
    user: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request to login endpoint', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockAuthResponse);
    });

    it('should handle login error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should send POST request to register endpoint', () => {
      const registerData: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockAuthResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should send GET request to me endpoint', () => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('validateToken', () => {
    it('should send POST request to validate-token endpoint', () => {
      const mockValidationResponse = { valid: true };

      service.validateToken().subscribe(response => {
        expect(response).toEqual(mockValidationResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/validate-token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockValidationResponse);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const testToken = 'test-token-123';
      localStorage.setItem('token', testToken);

      const token = service.getToken();
      expect(token).toBe(testToken);
    });

    it('should return null when no token in localStorage', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(localStorage.getItem('token')).toBe('test-token');

      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when valid token exists', () => {
      // Create a mock JWT token with future expiration
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const mockPayload = { exp: futureTimestamp, sub: '1' };
      const mockToken = 'header.' + btoa(JSON.stringify(mockPayload)) + '.signature';
      
      localStorage.setItem('token', mockToken);
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false when token is expired', () => {
      // Create a mock JWT token with past expiration
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const mockPayload = { exp: pastTimestamp, sub: '1' };
      const mockToken = 'header.' + btoa(JSON.stringify(mockPayload)) + '.signature';
      
      localStorage.setItem('token', mockToken);
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return false when token is invalid', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });
});