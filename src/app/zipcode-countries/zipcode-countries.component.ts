import { Component, inject } from '@angular/core';
import { LocationService } from 'app/location.service';

@Component({
  selector: 'app-zipcode-countries',
  template: `
    @for ( location of loc.locations(); track location.zip + ',' +location.country.id) {
      <div>{{location.zip}}, {{ location.country.description }} <button (click)="loc.removeLocation(location)">x</button></div>
    } 
  `,
  styles: ``
})
export class ZipcodeCountriesComponent {
  protected loc = inject(LocationService);
}
