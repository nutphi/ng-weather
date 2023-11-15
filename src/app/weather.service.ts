import {Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BehaviorSubject, Observable, OperatorFunction, Subject, combineLatest, forkJoin, interval, merge, of, timer} from 'rxjs';
import {map, mergeMap, share, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast, Weather, Weathers} from './forecasts-list/forecast.type';

@Injectable()
export class WeatherService {
  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private zipcodes = signal<string[]>([]);
  private trigger$ = new BehaviorSubject<void>(null);
  private unsubscribe$ = new Subject<void>();
  public request$!: Observable<any>;
  constructor(private http: HttpClient) { }

  init() {
    this.trigger$.pipe(
      switchMap((_) => {
        const zipcodes = (this.zipcodes() ?? []).filter(value => !!value);
        const getConditions$ = [...zipcodes].map(zipcode => this.getConditionAndZipInterval(zipcode));
        return getConditions$.length ? combineLatest(getConditions$): of([]);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe((value: ConditionsAndZip[]) => {
      this.currentConditions.update(v => value);
    });
  }

  destroy() {
    this.unsubscribe$.next();
  }

  getConditionAndZipInterval(zipcode: string): Observable<ConditionsAndZip> {
    return timer(0, 5000).pipe(
      switchMap(() => this.getCondition(zipcode)),
      map((data) => ({ data, zip: zipcode } as ConditionsAndZip))
    );
  }

  getCondition(zipcode: string): Observable<CurrentConditions> {
    // also adding map icon
    // set the request for observable
    this.request$ =this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
      .pipe(map(this.mapConditionWithIconSrc<CurrentConditions>));
    return this.request$;
  }

  mapConditionWithIconSrc = <T extends Weathers>(data: T) => {
    return {
    ...data,
    weather: data.weather.map((w: Weather) => ({
      ...w, src: this.getWeatherIcon(w.id)
      }))
    }
  };

  addCurrentConditions(zipcode: string): void {
    this.zipcodes.update(zipcodes => {
      zipcodes.push(zipcode);
      return zipcodes;
    });
    this.trigger$.next();
  }

  removeCurrentConditions(zipcode: string) {
    // remove zipcode
    this.zipcodes.update(zipcodes => {
      for (let i in zipcodes) {
        if (zipcodes[i] == zipcode)
          zipcodes.splice(+i, 1);
      }
      return zipcodes;
    });
    this.trigger$.next();
    // TODO: update condition
    // this.currentConditions.update(conditions => {
    //   for (let i in conditions) {
    //     if (conditions[i].zip == zipcode)
    //       conditions.splice(+i, 1);
    //   }
    //   return conditions;
    // });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
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
