import {Routes, provideRouter, withComponentInputBinding} from '@angular/router';
import {ForecastsListComponent} from "./forecasts-list/forecasts-list.component";
import {MainPageComponent} from "./main-page/main-page.component";
import { EnvironmentProviders } from '@angular/core';

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'forecast/:country/:zipcode', component: ForecastsListComponent
  }
];

export const routing: EnvironmentProviders = provideRouter(appRoutes, withComponentInputBinding());
