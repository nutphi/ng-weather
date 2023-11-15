import { Component, DestroyRef, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { LocationService } from "../location.service";
import { WeatherService } from 'app/weather.service';
import { Country, ZipCountry } from 'app/current-conditions/current-conditions.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, map, tap } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountryService } from 'app/country.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  @ViewChild("add", {read: TemplateRef, static: true}) addTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("adding", { read: TemplateRef, static: true }) addingTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("failed", {read: TemplateRef, static: true}) failedTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("done", {read: TemplateRef, static: true}) doneTemp!: TemplateRef<HTMLTemplateElement>;
  @ViewChild("container", { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  destroyRef = inject(DestroyRef);

  private service = inject(LocationService);
  protected weatherService = inject(WeatherService);
  protected countryService = inject(CountryService);
  protected countries = this.countryService.getCountriesSignal();
  protected selectedCountry!: Country;
  private fb = inject(FormBuilder);

  protected group: FormGroup = this.fb.group({
    zip: ['', Validators.required],
    country: [{description: 'United States', id: 'us'}, Validators.required]
  });

  protected isValid$ =
    merge(of(false), this.group.statusChanges.pipe(map((value) => value === 'VALID')));

  constructor() { }

  ngAfterViewInit() {
    this.isValid$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((isValid) => {
      this.changeState(isValid ? this.addTemp: this.failedTemp);
    });
  }

  addLocation() {
    // if valid and have observable
    if (this.group.valid) {
      const { zip, country } = this.group.getRawValue() as ZipCountry;
      this.service.addLocation({ zip, country });
      this.updateButton();
    }
  }

  private updateButton() {
    if (this.weatherService.request$) {
      this.changeState(this.addingTemp);
      this.weatherService.request$.pipe(
        tap(() => {
          this.changeState(this.doneTemp);
        }),
        delay(2000),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.changeState(this.addTemp);
      });
    }
  }

  changeState(template: TemplateRef<HTMLTemplateElement>) {
    this.container.clear();
    this.container.createEmbeddedView(template);
  }
}
