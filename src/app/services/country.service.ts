import {DestroyRef, Injectable, signal, inject, Signal} from '@angular/core';
import {Country} from '../current-conditions/current-conditions.type';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CountryService {
  private countries = signal<Country[]>([]);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);

  constructor() {
    // setup countries
    this.getCountriesJSON()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((countries: Country[]) => {
        this.countries.set(countries);
      });
  }

  getCountriesJSON(): Observable<any> {
    return this.http.get('./assets/countries.json');
  }

  // to display list of countries (id)
  getCountriesSignal(): Signal<Country[]> {
    return this.countries.asReadonly();
  }
}
