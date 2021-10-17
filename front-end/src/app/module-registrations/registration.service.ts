import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Registration } from './registration';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class RegistrationService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(private http: HttpClient) { }

    // Create
    createRegistration(registration: any): Observable<Registration> {
        console.log('registration:');
        console.log(registration);
        return this.http.post<Registration>(Env.API_URL + 'registrations', JSON.stringify(registration), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getRegistrations(): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'registrations.json')
        .pipe(retry(1), catchError(this.handleError))
    }

    // Read by id
    getRegistration(id: any): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'registrations/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by user id
    getRegistrationsByUser(id: any): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'users/' + id + '/registrations.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by Tournament id
    getRegistrationsByTournament(id: any): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'tournaments/' + id + '/registrations.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updateRegistration(id: any, registration: any): Observable<Registration> {
        return this.http.put<Registration>(Env.API_URL + 'registrations/' + id + '.json', JSON.stringify(registration), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Delete
    deleteRegistration(id: any){
        return this.http.delete<Registration>(Env.API_URL + 'registrations/' + id)
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