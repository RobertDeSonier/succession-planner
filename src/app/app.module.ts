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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PlantEffects } from './plants/store/plant.effects';
import { CalendarEffects } from './calendar/store/calendar.effects';
import { CalendarChartComponent } from './calendar/calendar-chart/calendar-chart.component';
import { CalendarDataEditComponent } from './calendar/calendar-data-edit/calendar-data-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthService } from './auth/auth.service';
import { BedsComponent } from './beds/beds.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { BedComponent } from './beds/bed/bed.component';
import { BedSpaceComponent } from './beds/bed/bed-space/bed-space.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlantBedComponent } from './beds/plant-bed/plant-bed.component';
import { PlantBedSpacesComponent } from './beds/plant-bed/plant-bed-spaces/plant-bed-spaces.component';


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
    BedsComponent,
    BedComponent,
    BedSpaceComponent,
    PlantBedComponent,
    PlantBedSpacesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([PlantEffects, CalendarEffects]),
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NgxMatColorPickerModule,
    DragDropModule,
    MatSidenavModule
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
    },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
