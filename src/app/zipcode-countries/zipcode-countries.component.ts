import {Component, inject} from '@angular/core';
import {LocationService} from 'app/services/location.service';

@Component({
  selector: 'app-zipcode-countries',
  template: `
    @for ( location of loc.locations(); track location.zip + ',' +location.country.id; let i =$index) {
      <div>{{location.zip}}, {{ location.country.description }} <button (click)="loc.removeLocation(i)">x</button></div>
    } 
  `,
  styles: ``
})
export class ZipcodeCountriesComponent {
  protected loc = inject(LocationService);
}
