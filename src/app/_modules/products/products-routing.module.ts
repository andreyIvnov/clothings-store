import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../account/_components/layout/layout.component';
import { AddEditComponent } from './_components/add-edit/add-edit.component';
import { ListComponent } from './_components/list/list.component';

const routes: Routes = [
  { path: '', 
    component: LayoutComponent,
    children: [
      {path:'',component:ListComponent},
      {path:'add',component:AddEditComponent},
      {path:'edit/:id',component:AddEditComponent}
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
