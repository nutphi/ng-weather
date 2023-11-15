import {CurrentConditions, ZipCountry} from './current-conditions/current-conditions.type';

export interface ConditionsAndZipCountry {
    zipCountry: ZipCountry;
    data: CurrentConditions;
}
