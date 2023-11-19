import {Component, inject} from '@angular/core';
import {LocationService} from "../services/location.service";
import {WeatherService} from 'app/services/weather.service';
import {Country, ZipCountry} from 'app/current-conditions/current-conditions.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {of, merge} from 'rxjs';
import {CountryService} from 'app/services/country.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  private service = inject(LocationService);
  protected weatherService = inject(WeatherService);
  protected countryService = inject(CountryService);
  protected countries = this.countryService.getCountriesSignal();
  protected selectedCountry!: Country;
  private fb = inject(FormBuilder);

  protected group: FormGroup = this.fb.group({
    zip: ['', Validators.required],
    country: [{description: 'United States', id: 'us'}, Validators.required]
  });

  protected isValid$ =
    merge(of(false), this.group.statusChanges.pipe(map((value) => value === 'VALID')));
  protected button$ = this.weatherService.firstRequest$;

  constructor() { }

  addLocation() {
    // if valid and have observable
    if (this.group.valid) {
      const { zip, country } = this.group.getRawValue() as ZipCountry;
      this.service.addLocation({ zip, country });
    }
  }
}
