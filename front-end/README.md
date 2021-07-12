# Angular 12 JWT Authentication & Authorization example

## Flow for User Registration and User Login
For JWT – Token based Authentication with Web API, we’re gonna call 2 endpoints:
- POST `api/auth/signup` for User Registration
- POST `api/auth/signin` for User Login

You can take a look at following flow to have an overview of Requests and Responses that Angular 10 Client will make or receive.

![angular-12-jwt-authentication-flow](angular-12-jwt-authentication-flow.png)

## Angular JWT App Diagram with Router and HttpInterceptor
![angular-12-jwt-authentication-overview](angular-12-jwt-authentication-overview.png)

For more detail, please visit:
> [Angular 12 JWT Authentication & Authorization with Web API](https://bezkoder.com/angular-12-jwt-auth/)

## With Spring Boot back-end

> [Angular + Spring Boot: JWT Authentication & Authorization example](https://bezkoder.com/angular-11-spring-boot-jwt-auth/)

## With Node.js Express back-end

> [Angular + Node.js Express: JWT Authentication & Authorization example](https://bezkoder.com/node-js-angular-11-jwt-authentication/)

Open `app/_helpers/auth.interceptor.js`, modify the code to work with **x-access-token** like this:
```js
...

// const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  ...

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    ...
    if (token != null) {
      // for Spring Boot back-end
      // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

      // for Node.js Express back-end
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }
    return next.handle(authReq);
  }
}

...
```

Run `ng serve --port 8081` for a dev server. Navigate to `http://localhost:8081/`.

## More practice
> [Angular CRUD Application example with Web API](https://bezkoder.com/angular-12-crud-app/)

> [Angular Pagination example using ngx-pagination](https://bezkoder.com/angular-11-pagination-ngx/)

> [Angular File Upload example with progress bar](https://bezkoder.com/angular-11-file-upload/)

Fullstack with Node.js Express:
> [Angular + Node.js Express + MySQL example](https://bezkoder.com/angular-12-node-js-express-mysql/)

> [Angular + Node.js Express + PostgreSQL](https://bezkoder.com/angular-11-node-js-express-postgresql/)

> [Angular + Node.js Express + MongoDB example](https://bezkoder.com/angular-12-mongodb-node-js-express/)

Fullstack with Spring Boot:
> [Angular + Spring Boot + MySQL example](https://bezkoder.com/angular-12-spring-boot-mysql/)

> [Angular + Spring Boot + PostgreSQL example](https://bezkoder.com/angular-12-spring-boot-postgresql/)

> [Angular + Spring Boot + MongoDB](https://bezkoder.com/angular-11-spring-boot-mongodb/)

> [Angular + Spring Boot: File upload example](https://bezkoder.com/angular-11-spring-boot-file-upload/)

Fullstack with Django:
> [Angular + Django Rest Framework](https://bezkoder.com/django-angular-11-crud-rest-framework/)

> [Angular + Django + MySQL](https://bezkoder.com/django-angular-mysql/)

> [Angular + Django + PostgreSQL](https://bezkoder.com/django-angular-postgresql/)

> [Angular + Django + MongoDB](https://bezkoder.com/django-angular-mongodb/)

Serverless with Firebase:
> [Angular Firebase CRUD Realtime DB | AngularFireDatabase](https://bezkoder.com/angular-11-firebase-crud/)

> [Angular Firestore CRUD | AngularFireStore](https://bezkoder.com/angular-11-firestore-crud-angularfirestore/)

> [Angular Upload File to Firebase Storage example](https://bezkoder.com/angular-11-file-upload-firebase-storage/)

Integration (run back-end & front-end on same server/port)
> [How to Integrate Angular with Node.js Restful Services](https://bezkoder.com/integrate-angular-10-node-js/)

> [How to Integrate Angular with Spring Boot Rest API](https://bezkoder.com/integrate-angular-11-spring-boot/)