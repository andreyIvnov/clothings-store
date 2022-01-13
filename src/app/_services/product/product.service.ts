import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Product} from 'src/app/_interfaces/product';
import {environment} from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ProductService {
  private productSubject: BehaviorSubject<Product>;
  public product: Observable<Product>;

  constructor(private router: Router, private http: HttpClient) {
    this.productSubject = new BehaviorSubject<Product>
    (
      JSON.parse(localStorage.getItem('registred-product') || '{}')
    );

    this.product = this.productSubject.asObservable();
  }

  public get productValue(): Product {
    return this.productSubject.value;
  }

  getAll() {
    return this.http.get<Product>(`${environment.apiUrl}/products`);
  }

  getById(id: number) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }

  addOrEditProduct(product: any) {
    return this.http.post(`${environment.apiUrl}/products`, product).subscribe(() => {
      this.router.navigate(['products/products-product-list'])
    });
  }

  changeProductCart(id: number, userId: number, isAdd:boolean) {
    return this.http.put<any>(`${environment.apiUrl}/products`, {productId: id, userId:userId, isAdd:isAdd});
  }
}
