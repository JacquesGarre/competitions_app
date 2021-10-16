import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Pool } from './pool';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class PoolService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(private http: HttpClient) { }

    // Create
    createPool(pool: any): Observable<Pool> {
        console.log('pool:');
        console.log(pool);
        return this.http.post<Pool>(Env.API_URL + 'pools', JSON.stringify(pool), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getPools(): Observable<Pool> {
        return this.http.get<Pool>(Env.API_URL + 'pools.json')
        .pipe(retry(1), catchError(this.handleError))
    }

    // Read by id
    getPool(id: any): Observable<Pool> {
        return this.http.get<Pool>(Env.API_URL + 'pools/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by user id
    getPoolsByUser(id: any): Observable<Pool> {
        return this.http.get<Pool>(Env.API_URL + 'users/' + id + '/pools.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by Tournament id
    getPoolsByTournament(id: any): Observable<Pool> {
        return this.http.get<Pool>(Env.API_URL + 'tournaments/' + id + '/pools.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updatePool(id: any, pool: any): Observable<Pool> {
        return this.http.put<Pool>(Env.API_URL + 'pools/' + id + '.json', JSON.stringify(pool), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Delete
    deletePool(id: any){
        return this.http.delete<Pool>(Env.API_URL + 'pools/' + id)
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