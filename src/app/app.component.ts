import {Component, OnInit} from '@angular/core';
import {User} from './_interfaces/user';
import {AccountService} from './_services/account/account.service';
import {NavigationEnd, NavigationStart, Route, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;
  withHeader = false;

  constructor(private accountService: AccountService, private router: Router) {
    this.router.events.subscribe((event: any) => {
      // this.currentRoute = event.url;
      console.log('router', event);
      if (event instanceof NavigationStart) {
        if (event.url.includes('account'))
          this.withHeader = false;
        else
          this.withHeader = true;
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('current-user'))
      this.user = JSON.parse(localStorage.getItem('current-user') || '');
  }

  logout() {
    this.accountService.logout();
  }
}
