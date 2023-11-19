import {Injectable, computed, signal} from '@angular/core';
import {ZipCountry} from '../current-conditions/current-conditions.type';
import {StorageService} from './storage.service';
import {LOCATIONS_STORAGE} from './storage.model';

@Injectable()
export class LocationService {
  private locationsSignal = signal<ZipCountry[]>([]);
  public locations = this.locationsSignal.asReadonly();
  public locationNames = computed<string[]>(() =>
    this.locationsSignal()
      .map(zipCountry =>
        `${zipCountry.country.description} (${zipCountry.zip})`
      )
  );

  constructor(private storage: StorageService<ZipCountry>) {
    // run default
    const locations = this.storage.getLocalStorage<ZipCountry[]>(LOCATIONS_STORAGE, []);
    this.locationsSignal.set(locations);
  }

  addLocation(zipCountry: ZipCountry) {
    this.locationsSignal.update((locations: ZipCountry[]) => {
      this.storage.addValueIntoArrayLocalStorage(LOCATIONS_STORAGE, locations, zipCountry); // locations is updated via reference object
      return locations;
    });
  }

  removeLocation(index: number) {
    this.locationsSignal.update((locations: ZipCountry[]) => {
      this.storage.removeValueIntoArrayLocalStorage(LOCATIONS_STORAGE, locations, locations[index]); // locations is updated via reference object
      return locations;
    });
  }
}
