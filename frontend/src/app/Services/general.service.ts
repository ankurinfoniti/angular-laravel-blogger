import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() {}

  getShortDescription(value: string) {
    return value.slice(0, 50);
  }
}
