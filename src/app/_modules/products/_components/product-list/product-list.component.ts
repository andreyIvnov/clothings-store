import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ProductService} from 'src/app/_services/product/product.service';
import {Router} from "@angular/router";

@Component({
  selector: 'products-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

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

  addNew() {
    this.router.navigate(['products/add-product'])
  }

}
