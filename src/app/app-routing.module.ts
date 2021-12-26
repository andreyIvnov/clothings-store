import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { AuthGuard } from './_helpers/auth.guard';

const accountModule = () => import('./_modules/account/account.module').then(m => m.AccountModule)
const productsModule = () => import('./_modules/products/products.module').then(m => m.ProductsModule)

const routes: Routes = [
  { path:'',component:HomeComponent, canActivate:[AuthGuard]},
  // {path:'', redirectTo:'/account/login', pathMatch:'full'},
  { path: 'account', loadChildren: accountModule },
  { path: 'products', loadChildren: productsModule},
  // { path:'**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
