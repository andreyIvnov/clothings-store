import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ProductService } from 'src/app/_services/product/product.service';

@Component({templateUrl: './list.component.html'})

export class ListComponent implements OnInit {

  products: any;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    
    this.productService.getAll()
      .pipe(first())
      .subscribe(products => this.products = products)
  }

  deleteProduct(id:string){
    const product = this.products.find((x: { id: string; }) => x.id === id);
    product.isDeleting = true;

    this.productService.delete(id)
        .pipe(first())
        .subscribe(() => this.products = this.products.filter((x: { id: string; }) => x.id !==id))
  }


}
