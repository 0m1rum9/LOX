import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('Interceptor:', req.url, 'isRefreshing:', isRefreshing)
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('access');

  const authReq = token ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const refresh = localStorage.getItem('refresh');

        if (refresh) {
          return authService.refresh()!.pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = localStorage.getItem('access');
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }

        isRefreshing = false;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (isRefreshing) {
        isRefreshing = false;
      }

      return throwError(() => error);
    })
  );
  
};