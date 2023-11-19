import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ZipcodeEntryComponent} from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./services/location.service";
import {ForecastsListComponent} from './pages/forecasts-list/forecasts-list.component';
import {WeatherService} from "./services/weather.service";
import {CurrentConditionsComponent} from './current-conditions/current-conditions.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ButtonComponent} from './components/button/button.component';
import {CountrySelectInputComponent} from './components/country-select-input/country-select-input.component';
import {BoldSearchTextPipe} from './pipes/bold-search-text.pipe';
import {ZipcodeCountriesComponent} from './zipcode-countries/zipcode-countries.component';
import {CountryService} from './services/country.service';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    ButtonComponent,
    CountrySelectInputComponent,
    ZipcodeCountriesComponent,
    BoldSearchTextPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService, CountryService, routing],
  bootstrap: [AppComponent]
})
export class AppModule { }
