import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private subscriptions =new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
