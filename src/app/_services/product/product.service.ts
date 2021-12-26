import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'src/app/_interfaces/product';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ProductService {
  private productSubject: BehaviorSubject<Product>;
  public product: Observable<Product>;
  
  constructor(private router: Router, private http: HttpClient) 
  { 
    debugger
    this.productSubject = new BehaviorSubject<Product>
    (
      JSON.parse(localStorage.getItem('registred-product') || '{}')
    );

    this.product = this.productSubject.asObservable();
  }

  public get productValue(): Product{
    return this.productSubject.value;
  }

  getAll() {
    return this.http.get<Product>(`${environment.apiUrl}/products`);
  }

  getById(id: string){
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }
  
}
