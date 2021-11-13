import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';

import { UserService } from '../module-users/user.service';
import { PoolService } from '../module-pools/pool.service';
import { TournamentService } from '../module-tournaments/tournament.service';

import { Registration } from './registration';
import { User } from '../module-users/user';
import { Tournament } from '../module-tournaments/tournament';
import { Pool } from '../module-pools/pool';
import { Env } from '../_globals/env';

@Injectable({ providedIn: 'root' })
export class RegistrationService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    constructor(
        private http: HttpClient,
        public userService: UserService,
        public poolService: PoolService,
        public tournamentService: TournamentService,
        public token: TokenStorageService,
        
    ) { }

    // Create
    createRegistration(registration: any): Observable<Registration> {
        return this.http.post<Registration>(Env.API_URL + 'registrations', JSON.stringify(registration), this.httpOptions)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read
    getRegistrations(page: any = false): Observable<Registration> {
        let endpoint = Env.API_URL + 'registrations.jsonld';
        if(page){
            endpoint += '?page=' + page;
        }
        return this.http.get<Registration>(endpoint)
        .pipe(retry(1), catchError(this.handleError))
    }

    // Read
    getFilteredRegistrations(page: any = false, users:any = false, jerseyNumber:any = false, tournament:any = false, pools:any = false, presence:any = false, available:any = false): Observable<Registration> {
        let endpoint = Env.API_URL + 'registrations.jsonld';
        let params: any = [];
        if(page){
            params.push('page=' + page);
        }
        if(jerseyNumber){
            params.push('jerseyNumber='+jerseyNumber);
        }
        if(tournament){
            params.push('tournament='+tournament);
        }
        if(pools){
            params.push('pools='+pools);
        }
        if(presence){
            params.push('presence='+presence);
        }
        if(available){
            params.push('available='+available);
        }
        if(users){
            users.map((user: any) => {
                params.push('user[]='+user);
            })
        }
        if(params.length){
            endpoint += '?' + params.join('&');
        }
        return this.http.get<Registration>(endpoint)
            .pipe(retry(1), catchError(this.handleError))
        
    }

    // Read by id
    getRegistration(id: any): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'registrations/' + id + '.json')
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by user id
    getRegistrationsByUser(id: any, page:any = false): Observable<Registration> {
        let endpoint = Env.API_URL + 'registrations.jsonld?user=' + id;
        if(page){
            endpoint += '&page=' + page;
        }
        return this.http.get<Registration>(endpoint)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by Tournament id
    getRegistrationsByTournament(id: any, page:any = false): Observable<Registration> {
        let endpoint = Env.API_URL + 'tournaments/' + id + '/registrations.jsonld';
        if(page){
            endpoint += '?page=' + page;
        }
        return this.http.get<Registration>(endpoint)
        .pipe(retry(1), catchError(this.handleError))
    }  

    // Read by Pool id
    getRegistrationsByPool(id: any, page:any = false): Observable<Registration> {
        let endpoint = Env.API_URL + 'registrations.jsonld?pools='+id;
        if(page){
            endpoint += '&page=' + page;
        }
        return this.http.get<Registration>(endpoint)
        .pipe(retry(1), catchError(this.handleError))
    }  

    
    // Read by Tournament id and user id
    getRegistrationsByTournamentAndUser(tournamentID: any, userID: any): Observable<Registration> {
        return this.http.get<Registration>(Env.API_URL + 'tournaments/' + tournamentID + '/registrations.json?user='+userID)
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