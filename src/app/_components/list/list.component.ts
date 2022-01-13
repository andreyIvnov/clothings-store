import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from "../../_services/product/product.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() products: any[];
  @Input() userId: any;
  constructor(private productService: ProductService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  removeFromCart(product: any) {
    this.productService.changeProductCart(product.id, this.userId, false).subscribe(res => {
      this.products = res;
    });
  }

  addToCart(product: any) {
    if (product.customerId !== this.userId) {
      this.productService.changeProductCart(product.id, this.userId, true).subscribe((res: any) => {
        this.products = res.products;
        if (!res.error)
          localStorage.setItem('current-user', res.user);
        else
          alert(res.error);
      });
    } else {
      alert("You have it's item!!")
    }
  }

  deleteProduct(id: string) {
    this.productService.delete(id)
      .pipe(first())
      .subscribe(() => this.products = this.products.filter((x: { id: string; }) => x.id !== id))
  }
  edit(id: number) {
    // only if it's your product
    if (id === this.userId)
      this.router.navigate(['/products/edit', id]);
  }
}
