import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { UserService } from '../../module-users/user.service';
import { faUser, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faSitemap, faAlignLeft, faCog, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TournamentService } from 'src/app/module-tournaments/tournament.service';

@Component({
    selector: 'app-module-registrations-view',
    templateUrl: './module-registrations-view.component.html',
    styleUrls: ['./module-registrations-view.component.css']
})
export class ModuleRegistrationsViewComponent implements OnInit {

    faUser = faUser;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faSitemap = faSitemap;
    faAlignLeft = faAlignLeft;
    faCog = faCog;
    faObjectUngroup = faObjectUngroup;

    registration: any = {
        id: '',
        name: '',
        tournament: '',
        price: '',
        minPoints: '',
        maxPoints: '',
        startDate: '',
        endDate: '',
        createdAt: '',
        updatedAt: '',
        description: ''
    };
    untouchedRegistration: any;
    public isReadonly: boolean = true;
    users: any;
    currentUser: any;
    tournaments: any;
    startDate: any;
    endDate: any;

    form: any = {
        id: null,
        name: '',
        tournament: '',
        price: '',
        minPoints: '',
        maxPoints: '',
        startDate: '',
        endDate: '',
        createdAt: '',
        updatedAt: '',
        description: ''
    };

    constructor(
        public service: RegistrationService,
        public userService: UserService,
        public tournamentService: TournamentService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
        this.startDate = new Date();
        this.endDate = new Date();
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getRegistration(id).subscribe((data: any) => {
            this.registration = data;

            this.startDate = this.registration.startDate;
            this.endDate = this.registration.endDate;

            this.untouchedRegistration = this.registration;
            this.form = this.registration;
            this.userService.getCurrentUser().subscribe((data: any) => {
                this.currentUser = data[0];
                if(this.currentUser.roles.includes('ROLE_ADMIN')){
                    this.tournamentService.getTournaments().subscribe((data: any) => {
                        this.tournaments = data;
                    })
                } else {
                    this.tournamentService.getTournamentsByUser(this.currentUser.id).subscribe((data: any) => {
                        this.tournaments = data;
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
        this.service.getRegistration(id).subscribe((data: any) => {
            this.registration = data;
            this.untouchedRegistration = data;
            this.form = this.registration;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    onSubmit() {
        const updatedRegistration = {
            name: this.form.name,
            tournament: this.form.tournament,
            minPoints: parseInt(this.form.minPoints),
            maxPoints: parseInt(this.form.maxPoints),
            startDate: new Date(Date.parse(this.startDate)+3600*1000).toUTCString(),
            endDate: new Date(Date.parse(this.endDate)+3600*1000).toUTCString(),
            price: parseFloat(this.form.price),
            description: this.form.description,
        }
        this.service.updateRegistration(this.registration.id, updatedRegistration).subscribe((data: any) => {
            this.registration = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
