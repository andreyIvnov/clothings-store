import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, materialize, dematerialize} from 'rxjs/operators';

// array in local storage for registered users
const USERS_KAY = 'registred-users';
const PRODUCTS_KAY = 'products-list';
let users: any[] = localStorage.getItem(USERS_KAY) ? JSON.parse(localStorage.getItem(USERS_KAY) || '') : [];
let products: any[] = localStorage.getItem(PRODUCTS_KAY) ? JSON.parse(localStorage.getItem(PRODUCTS_KAY) || '') : [];
const ERROR_MESSAGE_NOT_HAVE_CASH = "ERROR_MESSAGE_NOT_HAVE_CASH";
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        //products
        case url.endsWith('/products') && method === 'GET':
          return getProductsList();
        case  url.match(/\/products\/\d+$/) && method === 'GET':
          return getProductById();
        case url.endsWith('/products') && method === 'POST':
          return addOrEditProduct();
        case url.match(/\/products\/\d+$/) && method === 'DELETE':
          return deleteProduct();
        case url.match('/products') && method === 'PUT':
          return updateProducts();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const {username, password} = body;
      const user = users.find((x: any) => x.username === username && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        ...basicDetailsAccount(user),
        token: 'fake-jwt-token'
      })
    }

    function register() {
      const user = body

      if (users.find((x: any) => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken')
      }

      user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
      // basic cash
      user.cash = 1000;
      users.push(user);
      localStorage.setItem(USERS_KAY, JSON.stringify(users));
      return ok({});
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users.map((x: any) => basicDetailsAccount(x)));
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      const user = users.find((x: any) => x.id === idFromUrl());
      return ok(basicDetailsAccount(user));
    }

    function updateUser() {
      if (!isLoggedIn()) return unauthorized();

      let params = body;
      let user = users.find((x: any) => x.id === idFromUrl());

      // only update password if entered
      if (!params.password) {
        delete params.password;
      }

      // update and save user
      Object.assign(user, params);
      localStorage.setItem(USERS_KAY, JSON.stringify(users));

      return ok({});
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter((x: any) => x.id !== idFromUrl());
      localStorage.setItem(USERS_KAY, JSON.stringify(users));
      return ok({});
    }

    // products
    function getProductsList() {
      if (!isLoggedIn()) return unauthorized();
      return ok(products.map((x: any) => basicDetailsProducts(x)));
    }

    function getProductById() {
      if (!isLoggedIn()) return unauthorized();

      const product = products.find((x: any) => x.id === idFromUrl());
      return ok(basicDetailsProducts(product));
    }

    function addOrEditProduct() {
      const product = body
      //not sold
//TODO add check validate

      /*      if (products.find((x: any) => x.username === user.username)) {
              return error('Username "' + user.username + '" is already taken')
            }*/
      if (product.id) {
        var foundIndex = products.findIndex(x => x.id == product.id);
        products[foundIndex] = product;
      } else {
        product.id = products.length ? Math.max(...products.map((x: any) => x.id)) + 1 : 1;
        product.isSale = false;
        products.push(product);
      }
      localStorage.setItem(PRODUCTS_KAY, JSON.stringify(products));
      return ok({});
    }

    function deleteProduct() {
      if (!isLoggedIn()) return unauthorized();

      products = products.filter((x: any) => x.id !== idFromUrl());
      localStorage.setItem(PRODUCTS_KAY, JSON.stringify(products));
      return ok({});
    }

    function updateProducts() {
      if (!isLoggedIn()) return unauthorized();
      let errorMessage = false;
      let params = body;
      let user = null;

      let product = products.find((x: any) => x.id === params.productId);
      let foundIndexProduct = products.findIndex(x => x.id == product.id);
      let foundIndexUser = users.findIndex(x => x.id == params.userId);

      if (params.isAdd) {
        if (users[foundIndexUser].cash >= product.price) {
          products[foundIndexProduct].customerId = params.userId;
          products[foundIndexProduct].isSale = true;
          users[foundIndexUser].cash = users[foundIndexUser].cash - product.price;
        } else  {
          errorMessage = true;
        }
      } else {
        products[foundIndexProduct].customerId = undefined;
        products[foundIndexProduct].isSale = false;
        users[foundIndexUser].cash = users[foundIndexUser].cash + product.price;
      }
      user = users[foundIndexUser];

      localStorage.setItem(PRODUCTS_KAY, JSON.stringify(products));

      return ok({products:products, user:user, error:errorMessage ? ERROR_MESSAGE_NOT_HAVE_CASH : null});
    }

    // helper functions

    function ok(body: any) {
      return of(new HttpResponse({status: 200, body}))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any) {
      return throwError({error: {message}})
        .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorized'}})
        .pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetailsAccount(user: any) {
      const {id, username, firstName, lastName, cash} = user;
      return {id, username, firstName, lastName, cash};
    }

    function basicDetailsProducts(product: any) {
      const {id, title, description, image, price, userId, userName, customerId, isSale, fileSource} = product;
      return {id, title, description, image, price, userId, userName, customerId, isSale, fileSource};
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
