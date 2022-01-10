import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_interfaces/user';
import { AccountService } from 'src/app/_services/account/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  user: User | null;
  constructor(private accountService:AccountService) {
    this.user = this.accountService.userValue || null;
   }

  ngOnInit(): void {
  }

}
