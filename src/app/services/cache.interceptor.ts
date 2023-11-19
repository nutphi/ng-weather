import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { CacheService } from './cache.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);
  if (!req.params.get('cache')) {
    return next(req);
  }
  req.params.delete('cache');

  const cachedResponse = cache.get(req);
  return cachedResponse ? of(cachedResponse) : next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const maxAge = +req.params.get('maxAge') as number;
        req.params.delete('maxAge');
        cache.put(req, event, maxAge);
      }
    }));
};
