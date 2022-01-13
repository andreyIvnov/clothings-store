import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../_interfaces/user";
import {AccountService} from "../../_services/account/account.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User | null;
  @Input() withHeader: boolean;

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('current-user'))
      this.user = JSON.parse(localStorage.getItem('current-user') || '');
  }

  logout() {
    this.accountService.logout();
  }
}
