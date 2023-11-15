import { Component, Input, afterNextRender } from '@angular/core';
import {WeatherService} from '../weather.service';
import {Forecast} from './forecast.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  @Input() zipcode: string;
  @Input() country: string;
  forecast$: Observable<Forecast>;

  constructor(protected weatherService: WeatherService) {
    afterNextRender(() => {
      this.forecast$ = weatherService.getForecast(this.country, this.zipcode);
    });
  }
}
