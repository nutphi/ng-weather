import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCache } from './http-cache.interface';

@Injectable()
export class CacheService {
  static readonly TWO_HOURS = 1000 * 6; // 2 hours - 1000 * 60 * 60 * 2 (milisec, sec, min, hours)
  cache = new Map<string, HttpCache>();
  get(req: HttpRequest<unknown>): HttpResponse<unknown> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);
    if (!cached || this.isExpired(cached)) {
      return undefined;
    }
    return cached.response;
  }

  isExpired(cached: HttpCache): boolean {
    return cached.lastHttpCallTimestamp < Date.now() - CacheService.TWO_HOURS;
  }

  put(req: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    const url = req.urlWithParams;
    const entry: HttpCache = { url, response, lastHttpCallTimestamp: Date.now() };
    this.cache.set(req.urlWithParams, entry);
  }
}
