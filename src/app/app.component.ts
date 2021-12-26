import { Component } from '@angular/core';
import { User } from './_interfaces/user';
import { AccountService } from './_services/account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User
  title = 'Shoes Market';
  constructor(private accountService: AccountService)
  {
    this.accountService.user.subscribe(x => this.user = x)
    // this.accountService.logout();
  }

  logout() {
    
    this.accountService.logout();
  }
}
