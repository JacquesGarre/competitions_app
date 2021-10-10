import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class UserService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(private http: HttpClient) { }

    // Create
    createUser(organization: any): Observable<User> {
        console.log(organization)
        return this.http.post<User>(Env.API_URL + 'users', JSON.stringify(organization), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getUsers(): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users.json')
        .pipe(retry(1), catchError(this.handleError),)
    }

    // Read
    getUsersByOrganization(id: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users')
        .pipe(retry(1), catchError(this.handleError),)
    }

    // Read by id
    getUser(id: any): Observable<User> {
        return this.http.get<User>(Env.API_URL + 'users/' + id)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updateUser(id: any, organization: any): Observable<User> {
        return this.http.put<User>(Env.API_URL + 'users/' + id, JSON.stringify(organization), this.httpOptions)
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