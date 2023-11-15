import {Injectable, inject, signal} from '@angular/core';
import {WeatherService} from "./weather.service";
import {ZipCountry} from './current-conditions/current-conditions.type';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {
  private weatherService = inject(WeatherService)
  locations = signal<ZipCountry[]>([]);

  constructor() {
    // run default
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locations.set(JSON.parse(locString ?? '[]'));
    for (let loc of this.locations())
      this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipCountry: ZipCountry) {
    this.locations.update(loc => {
      loc.push(zipCountry)
      return loc;
    });
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
    this.weatherService.addCurrentConditions(zipCountry);
  }

  removeLocation(zipCountry: ZipCountry) {
    // update locations
    this.locations.update(locations => {
      let index = locations.findIndex(
        (loc) => loc.zip === zipCountry.zip && loc.country.id === zipCountry.country.id
      );
      if (index !== -1) {
        locations.splice(index, 1);
        // remove zip + country
        localStorage.setItem(LOCATIONS, JSON.stringify(locations) ?? '[]');
        this.weatherService.removeCurrentConditions(index);
      }
      return locations;
    });
  }
}
