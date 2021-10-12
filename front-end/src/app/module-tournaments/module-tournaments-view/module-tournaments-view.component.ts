import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Tournament } from '../tournament';
import { TournamentService } from '../tournament.service';
import { UserService } from '../../module-users/user.service';
import { faUsers, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faGem } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from 'src/app/module-organizations/organization.service';

@Component({
    selector: 'app-module-tournaments-view',
    templateUrl: './module-tournaments-view.component.html',
    styleUrls: ['./module-tournaments-view.component.css']
})
export class ModuleTournamentsViewComponent implements OnInit {

    faUsers = faUsers;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faGem = faGem;

    tournament: any = {
        id: '',
        name: '',
        organization: '',
        registrationFormOpen: '',
        creator: '',
        createdAt: '',
        updatedAt: '',
    };
    untouchedTournament: any;
    public isReadonly: boolean = true;
    users: any = [];
    currentUser: any;

    form: any = {
        id: null,
        name: null,
        organization: null,
        registrationFormOpen: null,
        creator: null,
        createdAt: null,
        updatedAt: null,
    };

    constructor(
        public service: TournamentService,
        public userService: UserService,
        public organizationService: OrganizationService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getTournament(id).subscribe((data: any) => {
            this.tournament = data;
            this.untouchedTournament = this.tournament;
            this.form = this.tournament;
            this.ngxLoader.stopLoader('page-loader');
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
        const name = this.form.name;
        this.service.updateTournament(this.tournament.id, {
            name: this.form.name,
            organization: this.form.organization,
            registrationFormOpen: this.form.registrationFormOpen
        }).subscribe((data: any) => {
            this.tournament = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
