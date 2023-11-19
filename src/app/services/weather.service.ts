import {Injectable, Signal, signal} from '@angular/core';
import {BehaviorSubject, Observable, Subject, timer} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ConditionsAndZipCountry, CurrentConditions, ZipCountry} from '../current-conditions/current-conditions.type';
import {Forecast, Weather, Weathers} from '../pages/forecasts-list/forecast.type';
import {StorageService} from './storage.service';
import {LOCATIONS_STORAGE, StorageArrayActionItem} from './storage.model';

@Injectable()
export class WeatherService {
  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditionObservableSignal = signal<Observable<ConditionsAndZipCountry>[]>([]);
  public conditions$ = this.currentConditionObservableSignal.asReadonly();
  private unsubscribe$ = new Subject<void>();
  private buttonTrigger$ = new BehaviorSubject<void>(null); // 
  public firstRequest$: Observable<void> = this.buttonTrigger$.asObservable(); // button update

  constructor(private http: HttpClient, private storage: StorageService<ZipCountry>) {
    const locations = this.storage.getLocalStorage<ZipCountry[]>(LOCATIONS_STORAGE, []);
    locations.forEach((location) => this.addCurrentConditions(location));

    this.storage.change$.pipe(
      filter((item: StorageArrayActionItem<ZipCountry>) => item.key === LOCATIONS_STORAGE)
    ).subscribe(
      (item: StorageArrayActionItem<ZipCountry>) => {
        switch (item.action.type) {
          case 'added':
            this.addCurrentConditions(item.value);
            break;
          case 'removed':
            this.removeCurrentConditions(item.action.index);
            break;
        }
      }
    );
  }

  destroy() {
    this.unsubscribe$.next();
  }

  private getConditionAndZipInterval(zipCountry: ZipCountry): Observable<ConditionsAndZipCountry> {
    return timer(0, 5000).pipe(
      switchMap((n: number) => {
        if (n === 0) {
          this.buttonTrigger$.next();
        }
        return this.getCondition(zipCountry);
      })
    );
  }

  private getCondition(zipCountry: ZipCountry): Observable<ConditionsAndZipCountry> {
    // also adding map icon
    // set the request for observable for adding done
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipCountry.zip},${zipCountry.country.id}&units=imperial&APPID=${WeatherService.APPID}`)
      .pipe(
        filter(v => {
          return !!v;
        }),
        map(this.mapConditionWithIconSrc<CurrentConditions>),
        map((data) => ({ data, zipCountry } as ConditionsAndZipCountry))
      );
  }

  private mapConditionWithIconSrc = <T extends Weathers>(data: T) => {
    return {
    ...data,
    weather: data.weather.map((w: Weather) => ({
      ...w, src: this.getWeatherIcon(w.id)
      }))
    }
  };

  private addCurrentConditions(zipCountry: ZipCountry): void {
    this.currentConditionObservableSignal.update(observableList => {
      observableList.push(this.getConditionAndZipInterval(zipCountry));
      return observableList;
    });
  }

  private removeCurrentConditions(index: number) {
    // remove zipcode
    this.currentConditionObservableSignal.update(observableList => {
      observableList.splice(index, 1);
      return observableList;
    });
  }

  public getCurrentConditionObservableSignal(): Signal<Observable<ConditionsAndZipCountry>[]> {
    return this.currentConditionObservableSignal.asReadonly();
  }

  public getForecast(country: string, zipcode: string): Observable<Forecast> {
    const params = new HttpParams()
      .set('cache', 'true');
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},${country}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`,
      { params }
    )
      .pipe(
        map((forcast: Forecast) => ({
          ...forcast, list: forcast.list.map(this.mapConditionWithIconSrc)
        })
      ));
  }

  private getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
