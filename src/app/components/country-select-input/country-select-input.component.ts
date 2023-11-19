import {Component, Input, afterNextRender, forwardRef} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Country} from 'app/current-conditions/current-conditions.type';
import {ControlValueAccessor} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-country-select-input',
  templateUrl: './country-select-input.component.html',
  providers:[
      {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectInputComponent),
      multi: true
    }],
  styles: `li {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    
    background-color: white;
  }
  li:hover {
    background: gray;
  }
  .dropdown-menu {
    display: block;
    top: auto;
    left: 200px;
  }
  `
})
export class CountrySelectInputComponent implements ControlValueAccessor{
  @Input() countries!: Country[];
  
  // Both onChange and onTouched are functions
  onChange: any = () => { };
  onTouched: any = () => { };
  
  // full name
  countryInput: FormControl<string> = new FormControl("");

  // { description: (country name), id: (country code) }
  country!: Country;

  // to hide dropdown
  hidden: boolean = false;

  // zipCountries$!: Observable<ZipCountry[]>;
  countries$!: Observable<Country[]>;

  constructor() {
    afterNextRender(() => {
      this.countries$ = this.countryInput.valueChanges.pipe(map((input: string) => {
        this.hidden = false;
        return this.countries
          .filter(() => !!input.trim().length)
          .filter((country: Country) =>
            country.description.toLowerCase().indexOf(input.toLowerCase()) !== -1
          );
      }));
    });
  }

  writeValue(obj: Country): void {
    this.country = obj;
    this.countryInput.patchValue(obj?.description);
  }

  // We implement this method to keep a reference to the onChange
  // callback function passed by the forms API
  registerOnChange(fn) {
    this.onChange = fn;
  }
  // We implement this method to keep a reference to the onTouched
  //callback function passed by the forms API
  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  select(country: Country) {
    this.onChange(country);
    this.countryInput.patchValue(country?.description);
    this.hidden = true;
  }

  displayDropdown() {
    this.hidden = false;
  }

  hideDropdown() {
    this.hidden = true;
  }
}
