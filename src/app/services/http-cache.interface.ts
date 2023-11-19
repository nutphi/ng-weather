import { HttpResponse } from "@angular/common/http";

export interface HttpCache {
  url: string;
  response: HttpResponse<unknown>;
  lastHttpCallTimestamp: number; 
}