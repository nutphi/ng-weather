import {Injectable, Signal, signal} from '@angular/core';
import {BehaviorSubject, Observable, Subject, merge, timer} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CurrentConditions, ZipCountry} from './current-conditions/current-conditions.type';
import {ConditionsAndZipCountry} from './conditions-and-zip.type';
import {Forecast, Weather, Weathers} from './forecasts-list/forecast.type';

@Injectable()
export class WeatherService {
  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditionsSignal = signal<ConditionsAndZipCountry[]>([]);
  private currentConditionObservableSignal = signal<Observable<ConditionsAndZipCountry>[]>([]);
  private unsubscribe$ = new Subject<void>();
  private buttonTrigger$ = new BehaviorSubject<void>(null);
  public firstRequest$: Observable<void> = this.buttonTrigger$.asObservable();
  constructor(private http: HttpClient) { }

  destroy() {
    this.unsubscribe$.next();
  }

  getConditionAndZipInterval(zipCountry: ZipCountry): Observable<ConditionsAndZipCountry> {
    return timer(0, 30000).pipe(
      switchMap((n: number) => {
        if (n === 0) {
          this.buttonTrigger$.next();
        }
        return this.getCondition(zipCountry);
      })
    );;
  }

  getCondition(zipCountry: ZipCountry): Observable<ConditionsAndZipCountry> {
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

  mapConditionWithIconSrc = <T extends Weathers>(data: T) => {
    return {
    ...data,
    weather: data.weather.map((w: Weather) => ({
      ...w, src: this.getWeatherIcon(w.id)
      }))
    }
  };

  addCurrentConditions(zipCountry: ZipCountry): void {
    this.currentConditionObservableSignal.update(zipcountriesObservableList => {
      zipcountriesObservableList.push(this.getConditionAndZipInterval(zipCountry));
      return zipcountriesObservableList;
    });
  }

  removeCurrentConditions(index: number) {
    // remove zipcode
    this.currentConditionObservableSignal.update(zipcountries => {
      zipcountries.splice(index, 1);
      return zipcountries;
    });
  }

  getCurrentConditionsSignal(): Signal<ConditionsAndZipCountry[]> {
    return this.currentConditionsSignal.asReadonly();
  }

  getCurrentConditionObservableSignal(): Signal<Observable<ConditionsAndZipCountry>[]> {
    return this.currentConditionObservableSignal.asReadonly();
  }

  getForecast(country: string, zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},${country}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
      .pipe(
        map((forcast: Forecast) => ({
          ...forcast, list: forcast.list.map(this.mapConditionWithIconSrc)
        })
      ));
  }

  getWeatherIcon(id): string {
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
