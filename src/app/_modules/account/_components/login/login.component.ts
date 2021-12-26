import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account/account.service';
import { AlertService } from 'src/app/_services/alert/alert.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  form: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    // debugger
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get f() { return this.form.contains } // getter for access to form fields

  onSubmit() {
    //reset alerts on submit
    // debugger
    this.alertService.clear();
    // if form is invaled is stopped hear
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if(!this.accountService.login(this.form.getRawValue())){
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);  
      // debugger
    }
    
    this.loading = false;
    

  }
}
