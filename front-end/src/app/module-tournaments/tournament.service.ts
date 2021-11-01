import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Tournament } from './tournament';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class TournamentService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(private http: HttpClient) { }

    // Create
    createTournament(tournament: any): Observable<Tournament> {
        console.log('tournament:');
        console.log(tournament);
        return this.http.post<Tournament>(Env.API_URL + 'tournaments', JSON.stringify(tournament), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getTournaments(): Observable<Tournament> {
        return this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
        .pipe(retry(1), catchError(this.handleError))
    }

    // Read by id
    getTournament(id: any): Observable<Tournament> {
        return this.http.get<Tournament>(Env.API_URL + 'tournaments/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by id
    getTournamentsByUser(id: any): Observable<Tournament> {
        return this.http.get<Tournament>(Env.API_URL + 'users/' + id + '/tournaments.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by org id & uri
    getTournamentByOrganizationAndUri(organizationID: any, uri: any): Observable<Tournament> {
        return this.http.get<Tournament>(Env.API_URL + 'organizations/' + organizationID + '/tournaments.json?uri='+uri)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Update
    updateTournament(id: any, tournament: any): Observable<Tournament> {
        return this.http.put<Tournament>(Env.API_URL + 'tournaments/' + id + '.json', JSON.stringify(tournament), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Delete
    deleteTournament(id: any){
        return this.http.delete<Tournament>(Env.API_URL + 'tournaments/' + id)
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