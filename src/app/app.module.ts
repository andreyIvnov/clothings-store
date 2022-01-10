import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakeBackendProvider } from './_helpers/fake-backend.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './_components/home/home.component';
import { AlertComponent } from './_components/alert/alert.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers:
  [
    {provide: HTTP_INTERCEPTORS, useClass:JwtInterceptor,multi:true},
    { provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi: true },

    fakeBackendProvider
  ],

  bootstrap:
  [AppComponent]
})
export class AppModule { }
