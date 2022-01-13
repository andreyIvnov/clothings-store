import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './_components/product-list/product-list.component';
import { LayoutComponent } from './_components/layout/layout.component';
import { AddEditComponent } from './_components/add-edit/add-edit.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ListComponent} from "../../_components/list/list.component";




@NgModule({
  declarations: [
    ProductListComponent,
    LayoutComponent,
    AddEditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProductsModule { }
