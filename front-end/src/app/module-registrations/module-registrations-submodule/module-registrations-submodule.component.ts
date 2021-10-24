import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Env } from '../../_globals/env';

import { User } from '../../module-users/user';
import { Tournament } from '../../module-tournaments/tournament';
import { Pool } from '../../module-pools/pool';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes, faClipboardList, faCheck } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModuleRegistrationsAddModalFormComponent } from '../module-registrations-add-modal-form/module-registrations-add-modal-form.component';
import { ModuleRegistrationsLinkModalFormComponent } from '../module-registrations-link-modal-form/module-registrations-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
    selector: 'app-module-registrations-submodule',
    templateUrl: './module-registrations-submodule.component.html',
    styleUrls: ['./module-registrations-submodule.component.css'],
    providers: [DatePipe]
})
export class ModuleRegistrationsSubmoduleComponent implements OnChanges {

    faTimes = faTimes;
    faSitemap = faSitemap;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    faClipboardList = faClipboardList;
    faCheck = faCheck;

    pools: any;
    users: any;
    currentUser: any;
    tournaments: any;

    registrations: any = [];
    registrationForm: any;
    allRegistrationDetails: any;
    forms: any = [];

    @Input() parent: any;
    @Input() parentModule: any;

    constructor(
        private http: HttpClient,
        private token: TokenStorageService,
        public service: RegistrationService,
        public userService: UserService,
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

    ngOnChanges(): void {
        this.initRegistrations();
    }

    initRegistrations() {
        // Registrations as submodule in user
        // if(this.parent.id && this.parentModule == 'tournaments'){
        //     this.service.getRegistrationsByTournament(this.parent.id).subscribe((data: any) => {
        //         if (data.length) {
        //             this.registrations = data;
        //             this.registrationForm = this.formBuilder.group({
        //                 registrationDetails: this.formBuilder.array(
        //                     this.registrations.map((x: any) => 
        //                         this.formBuilder.group({
        //                             id: [x.id, [Validators.required, Validators.minLength(2)]],
        //                             name: [x.name, [Validators.required, Validators.minLength(2)]],
        //                             minPoints: [x.minPoints, [Validators.required, Validators.minLength(2)]],
        //                             maxPoints: [x.maxPoints, [Validators.required, Validators.minLength(2)]],
        //                             startDate: [x.startDate, [Validators.required, Validators.minLength(2)]],
        //                             endDate: [x.endDate, [Validators.required, Validators.minLength(2)]],
        //                             price: [x.price, [Validators.required, Validators.minLength(2)]],
        //                             createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
        //                             updatedAt: x.updatedAt, 
        //                             isReadonly: true
        //                         })
        //                     )
        //                 )
        //             })
        //         } else {
        //             this.registrations = [];
        //         }
        //     })
        // }

        // Registrations as submodule in user
        if(this.parent.id && this.parentModule == 'users'){

            let user = this.token.getUser();
            let pools = this.http.get<Pool>(Env.API_URL + 'pools.json')
            let users = this.http.get<User>(Env.API_URL + 'users.json')
            let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
            let registrations = this.http.get<Registration>(Env.API_URL + 'registrations.json?user='+this.parent.id);
            forkJoin([
                pools,
                users,
                tournaments,
                registrations
            ]).subscribe(results => {
                this.pools = results[0];
                this.users = results[1];
                this.currentUser = this.users.filter((el: any) => {
                    return el.email === user.email
                })[0];
                this.tournaments = results[2];
                this.registrations = results[3];
                this.registrationForm = this.formBuilder.group({
                    registrationDetails: this.formBuilder.array(
                        this.registrations.map((x: any) => {
                            var tournament: any = this.tournaments.filter((tournament: any) => {
                                return tournament.id.toString() === x.tournament.replace('/api/tournaments/','')
                            })[0]?.name
                            var user: any = this.users.filter((user: any) => {
                                return user.id.toString() === x.user.replace('/api/users/','')
                            })[0];
                            user = user.firstName + ' ' + user.lastName;
                            var pools: any = this.pools.filter((pool: any) => {
                                return x.pools.includes('/api/pools/'+pool.id.toString())
                            });
                            var poolsTxt: any = pools.map((pool: any) => {
                                return pool.name;
                            }).join(", ")
                            return this.formBuilder.group({
                                id: [x.id, [Validators.required, Validators.minLength(2)]],
                                user: [user, [Validators.required, Validators.minLength(2)]],
                                tournament: [tournament, [Validators.required, Validators.minLength(2)]],
                                payableAmount: [x.payableAmount, [Validators.required, Validators.minLength(2)]],
                                paidAmount: [x.paidAmount, [Validators.required, Validators.minLength(2)]],
                                jerseyNumber: [x.jerseyNumber, [Validators.required, Validators.minLength(2)]],
                                pools: [poolsTxt],
                                createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                updatedAt: x.updatedAt,
                                isReadonly: true
                            })
                        })
                    )
                })
                this.ngxLoader.stopLoader('page-loader');
            });

        }
    }

    // Create registration
    createRegistration() {
        const modalRef = this.modalService.open(ModuleRegistrationsLinkModalFormComponent, { centered: true });
        modalRef.componentInstance.parentModule = this.parentModule;
        if(this.parentModule == 'users'){
            modalRef.componentInstance.user = this.parent.id;
            modalRef.result.then((result) => {
                if (result == 'save') {
                    this.ngxLoader.startLoader('page-loader');
                    let values = modalRef.componentInstance.addForm.value;                    
                    let registration: any = {
                        tournament: 'api/tournaments/'+values.tournament,
                        user: 'api/users/'+this.parent.id,
                        payableAmount: parseFloat(values.payableAmount),
                        paidAmount: parseFloat(values.paidAmount),
                        creator: 'api/users/' + this.currentUser.id,
                        presence: values.presence == "1",
                        available: values.presence == "1",
                        pools: values.selectedPools.map((pool:any) => {
                            return '/api/pools/'+ pool.id
                        }),
                    }
                    this.service.createRegistration(registration).subscribe(data => {
                        this.initRegistrations();
                        this.ngxLoader.stopLoader('page-loader');
                    })
                }
            });
        }

    }

    // Delete registration
    deleteRegistration(registration: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting a registration';
        modalRef.componentInstance.content = 'Are you sure you want to delete this registration for <i>' + this.parent.firstName + ' ' + this.parent.lastName + '</i>?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
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
