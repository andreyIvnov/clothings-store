import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services/account/account.service';
import { AlertService } from 'src/app/_services/alert/alert.service';

@Component({
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required, 
      Validators.minLength(4)]]
    })
  }

  get f() {return this.form.controls;}

  onSubmit(){

    this.alertService.clear();

    if(this.form.invalid){return;}

    this.loading = true;
    this.accountService.register(this.form.getRawValue())

  }

}