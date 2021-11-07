import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, throwError, forkJoin } from 'rxjs';
import { Organization } from '../module-organizations/organization';
import { Registration } from '../module-registrations/registration';
import { Tournament } from '../module-tournaments/tournament';
import { Env } from '../_globals/env';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    content?: string;
    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    showUserBoard = false;
    username?: string;
    organizations: any;
    tournaments: any;

    constructor(
        private userService: UserService, 
        private organizationService: OrganizationService, 
        private tournamentService: TournamentService, 
        private tokenStorageService: TokenStorageService,
        private ngxLoader: NgxUiLoaderService,
        private http: HttpClient,
    ) { }

    ngOnInit(): void {
        this.isLoggedIn = !!this.tokenStorageService.getToken();
        if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();
            this.roles = user.roles;
            this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
            this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
            this.showUserBoard = this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN');
            this.username = user.username;
        }

        this.ngxLoader.startLoader('homepage-loader');
        let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
        let organizations = this.http.get<Organization>(Env.API_URL + 'organizations.json')
        forkJoin([
            tournaments,
            organizations
        ]).subscribe(results => {
            this.tournaments = results[0];
            this.organizations = results[1];
            this.tournaments.map((tournament: any) => {
                let orga = this.organizations.filter((org:any) => {
                    return org.id.toString() == tournament.organization.replace('/api/organizations/', '')
                })[0]
                tournament.organization = orga;
            })
            this.ngxLoader.stopLoader('homepage-loader');

        })
    }

    logout(): void {
        this.tokenStorageService.signOut();
        window.location.reload();
    }

}
