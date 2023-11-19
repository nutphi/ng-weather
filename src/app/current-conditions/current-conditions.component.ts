import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from "../services/weather.service";
import {LocationService} from "../services/location.service";
import {Router} from "@angular/router";
import {ConditionsAndZipCountry, ZipCountry} from './current-conditions.type';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<Observable<ConditionsAndZipCountry>[]> = this.weatherService.conditions$;

  showForecast(zipCountry : ZipCountry){
    this.router.navigate(['/forecast', zipCountry.country.id, zipCountry.zip]);
  }

  removeLocation(zipCountry: ZipCountry, event: Event) {
    event.stopPropagation(); 
    return this.locationService.removeLocation(zipCountry);
  }
}
