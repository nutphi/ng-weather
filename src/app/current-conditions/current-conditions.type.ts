import {Weathers} from "app/pages/forecasts-list/forecast.type"; // list of weather

// to group zip country and condition together
export interface ConditionsAndZipCountry {
    zipCountry: ZipCountry;
    data: CurrentConditions;
}
export interface CurrentConditions extends Weathers{
    coord:      Coord;
    // weather:    Weathers; remove it to use generic type
    base:       string;
    main:       Main;
    visibility: number;
    wind:       Wind;
    clouds:     Clouds;
    dt:         number;
    sys:        Sys;
    timezone:   number;
    id:         number;
    name:       string;
    cod:        number;
}

export interface Clouds {
    all: number;
}

export interface Coord {
    lon: number;
    lat: number;
}

export interface Main {
    temp:       number;
    feels_like: number;
    temp_min:   number;
    temp_max:   number;
    pressure:   number;
    humidity:   number;
}

export interface Sys {
    type:    number;
    id:      number;
    country: string;
    sunrise: number;
    sunset:  number;
}
export interface ZipCountry {
    zip: string;
    country: Country;
    invalid?: boolean;
}

export type Action = 'add' | 'remove';
export interface ZipCountryActionEvent {
    zipCountry: ZipCountry;
    action: Action;
}

export interface Country {
    id: string;
    description: string;
}

export interface Wind {
    speed: number;
    deg:   number;
    gust:  number;
}
