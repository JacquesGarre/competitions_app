import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user';
import { Env } from '../_globals/env';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(
        private http: HttpClient,
        public token: TokenStorageService,
    ) { }

    // Create
    createUser(user: any): Observable<User> {
        return this.http.post<User>(Env.API_URL + 'users', JSON.stringify(user), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getUsers(page:any = false): Observable<User> {
        let endpoint = Env.API_URL + 'users.jsonld';
        if(page){
            endpoint += '?page='+page;
        }
        return this.http.get<User>(endpoint)
        .pipe(retry(1), catchError(this.handleError),)
    }

    // Read
    getUsersByOrganization(id: any, page:any = false): Observable<User> {
        let endpoint = Env.API_URL + 'organizations/'+ id +'/users.jsonld';
        if(page){
            endpoint += '?page='+page;
        }
        return this.http.get<User>(endpoint)
        .pipe(retry(1), catchError(this.handleError),)
    }

    // Read
    getUserByRegistration(id: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'registrations/'+ id +'/user.json')
        .pipe(retry(1), catchError(this.handleError),)
    }

    // Read
    getFilteredUsers(page:any = false, email: any = false, firstName: any = false, lastName:any = false, licenceNumber:any = false): Observable<User> {
        let endpoint = Env.API_URL + 'users.jsonld';
        let params = [];
        if(page){
            params.push('page='+page);
        }
        if(email){
            params.push('email='+email);
        }
        if(firstName){
            params.push('firstName='+firstName);
        }
        if(lastName){
            params.push('lastName='+lastName);
        }
        if(licenceNumber){
            params.push('licenceNumber='+licenceNumber);
        }
        if(params.length){
            endpoint += '?' + params.join('&');
        }
        return this.http.get<User>(endpoint)
        .pipe(retry(1), catchError(this.handleError),)
    }
    


    // Read by id
    getUser(id: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Gets current user
    getCurrentUser(): Observable<User> {
        let user = this.token.getUser();
        return this.http.get<User>(Env.API_URL + 'users.json?email='+user.email)
        .pipe(retry(1), catchError(this.handleError))
    }  

    getUserByEmail(email: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users.json?email='+email)
        .pipe(retry(1), catchError(this.handleError))
    }  

    
    getUserByLicence(licenceNumber: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users.json?licenceNumber='+licenceNumber)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updateUser(id: any, user: any): Observable<User> {
        return this.http.put<User>(Env.API_URL + 'users/' + id + '.json', JSON.stringify(user), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Delete
    deleteUser(id: any){
        return this.http.delete<User>(Env.API_URL + 'users/' + id)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Error handling 
    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}