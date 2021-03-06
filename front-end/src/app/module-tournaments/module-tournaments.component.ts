import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Tournament } from './tournament';
import { TournamentService } from './tournament.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faGem } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleTournamentsAddModalFormComponent } from './module-tournaments-add-modal-form/module-tournaments-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from '../module-organizations/organization.service';

import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../module-users/user.service';

@Component({
    selector: 'app-module-tournaments',
    templateUrl: './module-tournaments.component.html',
    styleUrls: ['./module-tournaments.component.css'],
    providers: [DatePipe]
})
export class ModuleTournamentsComponent implements OnInit {

    faGem = faGem;
    faSitemap = faSitemap;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    tournaments: any = [];
    organizations: any = [];
    tournamentForm: any;
    allTournamentDetails: any;
    forms: any = [];
    currentUser: any;

    constructor(
        private token: TokenStorageService,
        public service: TournamentService,
        public userService: UserService,
        public organizationService: OrganizationService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.tournamentForm = this.formBuilder.group({
            tournamentDetails: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentUser = this.token.getUser();
        this.initTournaments();
    }

    initTournaments() {
        this.userService.getUserByEmail(this.currentUser.email).subscribe((data: any) => {
            if (data.length) {
                this.currentUser = data[0];
            }
            this.organizationService.getOrganizations().subscribe((data: any) => {
                this.organizations = data;
                this.service.getTournaments().subscribe((data: any) => {
                    if (data.length) {
                        this.tournaments = data;
                        this.tournamentForm = this.formBuilder.group({
                            tournamentDetails: this.formBuilder.array(
                                this.tournaments.map((x: any) => {
                                    var organization: any = this.organizations.filter((organization: any) => {
                                        return organization.id.toString() === x.organization.replace('/organizations/','')
                                    })[0]?.name
                                    return this.formBuilder.group({
                                        id: [x.id, [Validators.required, Validators.minLength(2)]],
                                        name: [x.name, [Validators.required, Validators.minLength(2)]],
                                        organization: [organization, [Validators.required, Validators.minLength(2)]],
                                        createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                        updatedAt: x.updatedAt,
                                        isReadonly: true
                                    })
                                })
                            )
                        })
                    } else {
                        this.tournaments = [];
                    }
                    this.ngxLoader.stopLoader('page-loader');
                    this.ngxLoader.stopLoader('task-loader');
                })
            })
        })
    }

    // Create tournament
    createTournament() {
        const modalRef = this.modalService.open(ModuleTournamentsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('task-loader');
                let values = modalRef.componentInstance.addForm.value;
                let tournament: any = {
                    name: values.name,
                    organization: 'organizations/' + values.organization,
                    startDate: new Date(Date.parse(values.startDate)+7200*1000).toUTCString(),
                    endDate: new Date(Date.parse(values.endDate)+7200*1000).toUTCString(),
                    creator: 'users/' + this.currentUser.id,
                    uri: values.uri,
                    registrationFormOpen: false
                }
                this.service.createTournament(tournament).subscribe(data => {
                    this.initTournaments();
                })
            }
        });
    }

    // Delete tournament
    deleteTournament(tournament: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppresion d\'un tournoi';
        modalRef.componentInstance.content = '??tes-vous s??r de vouloir supprimer le tournoi <i>' + tournament.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirmer';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('task-loader');
                this.service.deleteTournament(tournament.id).subscribe(data => {
                    this.initTournaments();
                })
            }
        });
    }

    // Shows details
    showTournament(tournament: any) {
        this.router.navigate(['/admin/tournaments/' + tournament.id])
    }

    // On submit inline edit form
    onSubmit(tournament: any) {
        const name = tournament.name;
        this.service.updateTournament(tournament.id, {
            name
        }).subscribe((data: any) => {
            tournament = data;
        })
        this.toggleForm(tournament)
    }

    toggleForm(tournament: any) {
        tournament.isReadonly = !tournament.isReadonly
    }

}
