import {AfterViewInit, Component, Input, afterNextRender, afterRender} from '@angular/core';
import {WeatherService} from '../../services/weather.service';
import {Forecast} from './forecast.type';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements AfterViewInit {

  @Input() zipcode: string;
  @Input() country: string;
  forecast$: Observable<Forecast>;

  constructor(protected weatherService: WeatherService) {}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.forecast$ = this.weatherService.getForecast(this.country, this.zipcode);
    });
  }
}
