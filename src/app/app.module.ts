import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PlantsComponent } from './plants/plants.component';
import { PlantsListComponent } from './plants/plants-list/plants-list.component';
import { PlantListItemComponent } from './plants/plants-list/plant-list-item/plant-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import * as fromApp from './store/app.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PlantEffects } from './plants/store/plant.effects';
import { CalendarEffects } from './calendar/store/calendar.effects';
import * as PlantActions from './plants/store/plant.actions';
import { CalendarChartComponent } from './calendar/calendar-chart/calendar-chart.component';
import { CalendarDataEditComponent } from './calendar/calendar-data-edit/calendar-data-edit.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalendarComponent,
    PlantsComponent,
    PlantsListComponent,
    PlantListItemComponent,
    CalendarChartComponent,
    CalendarDataEditComponent,
    AuthComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([PlantEffects, CalendarEffects]),
    ColorPickerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => {
        return () => {
          authService.autoLogin();
        }
      },
      multi: true,
      deps: [AuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
