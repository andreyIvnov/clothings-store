import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ProductService} from 'src/app/_services/product/product.service';
import {Router} from "@angular/router";
import {AccountService} from "../../../../_services/account/account.service";

@Component({
  selector: 'products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  products: any;
  userId: number;

  constructor(private productService: ProductService,
              private router: Router) {
    this.userId = JSON.parse(localStorage.getItem('current-user') || '')?.id;
  }

  ngOnInit(): void {
    this.productService.getAll()
      .pipe(first())
      .subscribe(products => {
        this.products = products
      })
  }

  deleteProduct(id: string) {
    this.productService.delete(id)
      .pipe(first())
      .subscribe(() => this.products = this.products.filter((x: { id: string; }) => x.id !== id))
  }


  addNew() {
    this.router.navigate(['products/add-product'])
  }

  edit(id: number) {
    this.router.navigate(['/products/edit', id]);
  }

  addToCart(product: any) {
    if (product.customerId !== this.userId) {
      this.productService.changeProductCart(product.id, this.userId, true).subscribe(res => {
        this.products = res;
      });
    } else {
      alert("You have it's item!!")
    }
  }

  removeFromCart(product: any) {
    this.productService.changeProductCart(product.id, this.userId, false).subscribe(res => {
      this.products = res;
    });
  }
}
