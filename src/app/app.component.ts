import {Component} from '@angular/core';
import {User} from './_interfaces/user';
import {AccountService} from './_services/account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User

  constructor(private accountService: AccountService) {
    if (!this.user && localStorage.getItem('current-user'))
      this.accountService.user.subscribe(currentUser => {
        if (currentUser && Object.keys(currentUser).length !== 0)
          this.user = currentUser;
  /*      else {
          this.accountService.logout();
        }*/
      })
  }

  logout() {
    this.accountService.logout();
  }
}
