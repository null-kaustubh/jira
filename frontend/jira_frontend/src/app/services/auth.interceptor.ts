import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('JWTAuthorization', `Bearer ${token}`),
    });
    return next(clonedRequest);
  }
  return next(req);
};