import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Registration } from './registration';
import { RegistrationService } from './registration.service';
import { Router } from '@angular/router';

import { User } from '../module-users/user';
import { Tournament } from '../module-tournaments/tournament';
import { Pool } from '../module-pools/pool';

import { Env } from '../_globals/env';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faGem, faObjectUngroup, faClipboardList,faCheck,faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleRegistrationsAddModalFormComponent } from './module-registrations-add-modal-form/module-registrations-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';
import { PoolService } from '../module-pools/pool.service';

import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../module-users/user.service';

@Component({
    selector: 'app-module-registrations',
    templateUrl: './module-registrations.component.html',
    styleUrls: ['./module-registrations.component.css'],
    providers: [DatePipe]
})
export class ModuleRegistrationsComponent implements OnInit {

    faGem = faGem;
    faSitemap = faSitemap;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    faObjectUngroup = faObjectUngroup;
    faClipboardList = faClipboardList;
    faCheck = faCheck;
    faTimes = faTimes;

    registrations: any = [];
    tournaments: any = [];
    registrationForm: any;
    allRegistrationDetails: any;
    forms: any = [];
    currentUser: any;
    users: any = [];
    pools: any = [];

    constructor(
        private http: HttpClient,
        private token: TokenStorageService,
        public service: RegistrationService,
        public userService: UserService,
        public poolService: PoolService,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.registrationForm = this.formBuilder.group({
            registrationDetails: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentUser = this.token.getUser();
        this.initRegistrations();
    }


    initRegistrations(){

        this.service.getRegistrations().subscribe((data: any) => {
            this.registrations = data;

            // tournament ids
            let tournamentIDS = this.registrations.map((reg: any) => {
                return 'id[]=' + reg.tournament.replace('/api/tournaments/','');
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // user ids
            let userIDS = this.registrations.map((reg: any) => {
                let userID = reg.user.replace('/api/users/','');
                return 'id[]=' + userID;
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // pools ids
            let poolIDS: any = [];
            this.registrations.map((reg: any) => {
                reg.pools.map((pool:any) => {
                    poolIDS.push('id[]=' + pool.replace('/api/pools/',''));
                });
            })
            poolIDS = poolIDS.filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // get linked entities 
            let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json?'+tournamentIDS)
            let pools = this.http.get<Pool>(Env.API_URL + 'pools.json?'+poolIDS)
            let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
            forkJoin([
                pools,
                users,
                tournaments
            ]).subscribe(results => {
                this.pools = results[0];
                this.users = results[1];
                this.tournaments = results[2];

                this.registrations.map((registration: any) => {
                    var tournament: any = this.tournaments.filter((tournament: any) => {
                        return tournament.id.toString() == registration.tournament.replace('/api/tournaments/','')
                    })[0]?.name
                    var user: any = this.users.filter((user: any) => {
                        return user.id.toString() == registration.user.replace('/api/users/','')
                    })[0];
                    var pools: any = this.pools.filter((pool: any) => {
                        return registration.pools.includes('/api/pools/'+pool.id.toString())
                    });
                    var poolsTxt: any = pools.map((pool: any) => {
                        return pool.name;
                    }).join(", ")

                    registration.user = user.firstName + ' ' + user.lastName
                    registration.licenceNumber = user.licenceNumber;
                    registration.pools = poolsTxt;
                    registration.tournament = tournament;

                })
                this.ngxLoader.stopLoader('task-loader');
                this.ngxLoader.stopLoader('page-loader');
            });
        })
    
    }

    // Create registration
    createRegistration() {
        const modalRef = this.modalService.open(ModuleRegistrationsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('task-loader');
                let values = modalRef.componentInstance.addForm.value;


                if(values.creationMode == 'newUser'){

                    let user: any = {
                        email: values.email,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        password: values.password,
                        licenceNumber: values.licenceNumber,
                        points: values.points,
                        genre: values.genre,
                        club: values.club,
                    }
                    this.userService.createUser(user).subscribe(data => {

                        let registration: any = {
                            tournament: 'api/tournaments/' + values.tournament,
                            pools: values.selectedPools.map((pool:any) => {
                                return 'api/pools/' + pool.id
                            }),
                            user: 'api/users/' + data.id,
                            payableAmount: parseFloat(values.payableAmount),
                            paidAmount: parseFloat(values.paidAmount),
                            presence: values.presence == "1",
                            available: values.presence == "1",
                            creator: 'api/users/' + this.currentUser.id
                        }

                        this.service.createRegistration(registration).subscribe(data => {
                            this.initRegistrations();
                        })
                        
                    })

                } else {

                    let registration: any = {
                        tournament: 'api/tournaments/' + values.tournament,
                        pools: values.selectedPools.map((pool:any) => {
                            return 'api/pools/' + pool.id
                        }),
                        user: 'api/users/' + values.user,
                        payableAmount: parseFloat(values.payableAmount),
                        paidAmount: parseFloat(values.paidAmount),
                        presence: values.presence == "1",
                        available: values.presence == "1",
                        creator: 'api/users/' + this.currentUser.id
                    }
    
                    // registration exists, we update it
                    if(values.registrationID !== ""){
                        this.service.updateRegistration(values.registrationID, registration).subscribe(data => {
                            this.initRegistrations();
                        })
                    // else we create it
                    } else {
                        this.service.createRegistration(registration).subscribe(data => {
                            this.initRegistrations();
                        })
                    }

                }
                
            }
        });
    }

    // Delete registration
    deleteRegistration(registration: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppression d\'une inscription';
        modalRef.componentInstance.content = 'Êtes-vous sûr de vouloir supprimer cette inscription ?';
        modalRef.componentInstance.confirmBtn = 'Confirmer';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('task-loader');
                this.service.deleteRegistration(registration.id).subscribe(data => {
                    this.initRegistrations();
                })
            }
        });
    }

    // Shows details
    showRegistration(registration: any) {
        this.router.navigate(['/admin/registrations/' + registration.id])
    }

    // On submit inline edit form
    onSubmit(registration: any) {
        const name = registration.name;
        this.service.updateRegistration(registration.id, {
            name
        }).subscribe((data: any) => {
            registration = data;
        })
        this.toggleForm(registration)
    }

    toggleForm(registration: any) {
        registration.isReadonly = !registration.isReadonly
    }

}
