import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'
import { User } from 'src/app/_interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject:BehaviorSubject<User>;
  public user:Observable<User>

  constructor
  (private router: Router, private http: HttpClient) 
  { 
    // debugger
    this.userSubject = new BehaviorSubject<User>
    (
      JSON.parse(localStorage.getItem('registred-users') || '{}')
    );

    this.user = this.userSubject.asObservable();
  }

  public get userValue():User
  {
    return this.userSubject.value;
  }

  login(form:any)
  {
    return this.http.post<User>(
      `${environment.apiUrl}/users/authenticate`,
      {username:form.username, password:form.password})
        .subscribe(
          // user => {
          // debugger
          // localStorage.setItem('user', 
          // JSON.stringify(user));
          // this.userSubject.next(user);
          // return user;
          user => {
            // localStorage.setItem('user',  //store user details and token in localstorage
            // JSON.stringify(user));
            this.userSubject.next(user);
          if(user){
            this.router.navigateByUrl('/home')
          }
          return user;
          },
          error => {
            debugger
           alert(error.error.message)
        })
  }

  logout()    //remove user from localStorage
  {
    localStorage.removeItem('user');
    this.userSubject.next(null as any);
    this.router.navigate(['account/login']);
  }

  register(user: User)
  {
    return this.http.post(`${environment.apiUrl}/users/register`, user)
    .subscribe(user => {})

  }

  getUsers()
  {
    return this.http.get<User []>(`${environment.apiUrl}/users`);
  }

  getUserById(id:string)
  {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: string, params: any)
  {
    return this.http.put(`${environment.apiUrl}/users/${id}`,params)
      .pipe(map(x => 
        {
          if(id == this.userValue.id)
          { // update local storage
            const user = { ...this.userValue, ...params};
            localStorage.setItem('user', JSON.stringify(user));

            this.userSubject.next(user);   //publish  updated user to subscribers
          }
          return x
        }));
  }

  delete(id:string)
  {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x =>
        {  // automatic logout if user try entryce to deleted user 
          if(id == this.userValue.id)
          { this.logout();}
          return x;
        }))
  }
}
