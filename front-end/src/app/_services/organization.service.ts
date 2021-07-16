import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Organization } from '../module-organizations/organization';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(private http: HttpClient) { }

    // GET ALL
    getOrganizations(): Observable<Organization> {
        return this.http.get<Organization>(Env.API_URL + 'organizations')
        .pipe(retry(1), catchError(this.handleError))
    }

    // DELETE BY ID
    deleteOrganization(id: any){
        return this.http.delete<Organization>(Env.API_URL + 'organizations/' + id)
        .pipe(retry(1), catchError(this.handleError))
    }

    // CREATE
    createOrganization(organization: any): Observable<Organization> {
        return this.http.post<Organization>(Env.API_URL + 'organizations', JSON.stringify(organization), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    /*
        // HttpClient API get() method => Fetch employee
        getEmployee(id): Observable<Employee> {
            return this.http.get<Employee>(this.apiURL + '/employees/' + id)
            .pipe(
            retry(1),
            catchError(this.handleError)
            )
        }  



        // HttpClient API put() method => Update employee
        updateEmployee(id, employee): Observable<Employee> {
            return this.http.put<Employee>(this.apiURL + '/employees/' + id, JSON.stringify(employee), this.httpOptions)
            .pipe(
            retry(1),
            catchError(this.handleError)
            )
        }


    */

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