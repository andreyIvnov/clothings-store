import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './_components/list/list.component';
import { LayoutComponent } from './_components/layout/layout.component';
import { AddEditComponent } from './_components/add-edit/add-edit.component';


@NgModule({
  declarations: [
    ListComponent,
    LayoutComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
