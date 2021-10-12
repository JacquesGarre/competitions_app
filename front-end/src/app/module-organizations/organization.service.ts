import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Organization } from './organization';
import { Env } from '../_globals/env';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(
        private http: HttpClient,
        public token: TokenStorageService
    ) { }

    // Create
    createOrganization(organization: any): Observable<Organization> {
        return this.http.post<Organization>(Env.API_URL + 'organizations', JSON.stringify(organization), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getOrganizations(): Observable<Organization> {
        return this.http.get<Organization>(Env.API_URL + 'organizations.json')
        .pipe(retry(1), catchError(this.handleError))
    }

    // Read by id
    getOrganization(id: any): Observable<Organization> {
        return this.http.get<Organization>(Env.API_URL + 'organizations/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by id
    getOrganizationsByUser(id: any): Observable<Organization> {
        return this.http.get<Organization>(Env.API_URL + 'users/' + id + '/organizations.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updateOrganization(id: any, organization: any): Observable<Organization> {
        return this.http.put<Organization>(Env.API_URL + 'organizations/' + id + '.json', JSON.stringify(organization), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Delete
    deleteOrganization(id: any){
        return this.http.delete<Organization>(Env.API_URL + 'organizations/' + id)
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