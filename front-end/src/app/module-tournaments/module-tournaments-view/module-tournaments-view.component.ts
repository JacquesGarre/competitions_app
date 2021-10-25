import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Tournament } from '../tournament';
import { TournamentService } from '../tournament.service';
import { UserService } from '../../module-users/user.service';
import { faUser, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faSitemap, faAlignLeft, faCog, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from 'src/app/module-organizations/organization.service';

@Component({
    selector: 'app-module-tournaments-view',
    templateUrl: './module-tournaments-view.component.html',
    styleUrls: ['./module-tournaments-view.component.css']
})
export class ModuleTournamentsViewComponent implements OnInit {

    faUser = faUser;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faSitemap = faSitemap;
    faAlignLeft = faAlignLeft;
    faCog = faCog;
    faObjectUngroup = faObjectUngroup;

    tournament: any = {
        id: '',
        name: '',
        organization: '',
        registrationFormOpen: '',
        creator: '',
        startDate: '',
        endDate: '',
        createdAt: '',
        updatedAt: '',
        description: '',
        uri: ''
    };
    untouchedTournament: any;
    public isReadonly: boolean = true;
    users: any;
    currentUser: any;
    organizations: any;
    startDate: any;
    endDate: any;
    uri: any;

    form: any = {
        id: null,
        name: null,
        organization: null,
        registrationFormOpen: null,
        creator: null,
        endDate: null,
        createdAt: null,
        updatedAt: null,
        description: '',
        uri: ''
    };

    constructor(
        public service: TournamentService,
        public userService: UserService,
        public organizationService: OrganizationService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
        this.startDate = new Date();
        this.endDate = new Date();
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getTournament(id).subscribe((data: any) => {
            this.tournament = data;

            this.startDate = this.tournament.startDate;
            this.endDate = this.tournament.endDate;

            this.untouchedTournament = this.tournament;
            this.form = this.tournament;
            this.userService.getCurrentUser().subscribe((data: any) => {
                this.currentUser = data[0];
                if(this.currentUser.roles.includes('ROLE_ADMIN')){
                    this.organizationService.getOrganizations().subscribe((data: any) => {
                        this.organizations = data;
                    })
                } else {
                    this.organizationService.getOrganizationsByUser(this.currentUser.id).subscribe((data: any) => {
                        this.organizations = data;
                    })
                }
                this.userService.getUsers().subscribe((data: any) => {
                    this.users = data;
                    this.ngxLoader.stopLoader('page-loader');
                })
            })
        })
    }

    toggleForm(){
        this.isReadonly = !this.isReadonly
    }

    resetForm(){
        this.ngxLoader.startLoader('page-loader');
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getTournament(id).subscribe((data: any) => {
            this.tournament = data;
            this.untouchedTournament = data;
            this.form = this.tournament;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    onSubmit() {
        const updatedTournament = {
            name: this.form.name,
            organization: this.form.organization,
            address: this.form.address,
            city: this.form.city,
            postalCode: this.form.postalCode,
            country: this.form.country,
            startDate: new Date(Date.parse(this.startDate)+3600*1000).toUTCString(),
            endDate: new Date(Date.parse(this.endDate)+3600*1000).toUTCString(),
            registrationFormOpen: this.form.registrationFormOpen && this.form.registrationFormOpen !== 'false',
            description: this.form.description,
            uri:this.form.uri
        }
        this.service.updateTournament(this.tournament.id, updatedTournament).subscribe((data: any) => {
            this.tournament = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
