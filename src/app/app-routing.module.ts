import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CalendarDataEditComponent } from './calendar/calendar-data-edit/calendar-data-edit.component';
import { CalendarResolverService } from './calendar/calendar-resolver.service';
import { CalendarComponent } from './calendar/calendar.component';
import { PlantsResolverService } from './plants/plants-resolver.service';
import { PlantsComponent } from './plants/plants.component';

const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full'},
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard], resolve: [CalendarResolverService] },
  { path: 'calendar/edit', component: CalendarDataEditComponent, canActivate: [AuthGuard], resolve: [CalendarResolverService] },
  { path: 'calendar/edit/:id', component: CalendarDataEditComponent, canActivate: [AuthGuard], resolve: [CalendarResolverService] },
  { path: 'plants', component: PlantsComponent, canActivate: [AuthGuard], resolve: [PlantsResolverService] },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
