import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';
import { UserService } from '../module-users/user.service';
import { RegistrationService } from '../module-registrations/registration.service';
import { NgxUiLoaderService,
    NgxUiLoaderModule,
    NgxUiLoaderConfig,
    NgxUiLoaderHttpModule,
    NgxUiLoaderRouterModule, 
    SPINNER,
    POSITION,
    PB_DIRECTION } from 'ngx-ui-loader';

import {
    faCalendarCheck,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { PoolService } from '../module-pools/pool.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FFTTService } from '../_services/fftt.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {

    organization: any;
    tournament: any;
    pools: any;
    addForm: any;
    payableAmount: any = 0.0;
    selectedPools: any = [];
    registrationID: any;
    licenceNumber: any;
    genre: any;
    email: any;
    firstName: any;
    lastName:any;
    points: any;
    club:any;
    fetching = false;
    registrationComplete = false;


    faCalendarCheck = faCalendarCheck;
    faMapMarkerAlt = faMapMarkerAlt;

    constructor(
        private route: ActivatedRoute,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
        public poolService: PoolService,
        private formBuilder: FormBuilder,
        public userService: UserService,
        public service: RegistrationService,
        private ngxModule: NgxUiLoaderModule,
        private ngxLoader: NgxUiLoaderService,
        public ffttService: FFTTService,
        private router: Router
    ) {

        this.ngxLoader.startLoader('page-loader-registration');

        // https://thiaville.smaaash.fr/tournoi-decembre-2021

        const regex = /https?:\/\/(.*).smaaash.fr\/(.*)/gm;
        const url = window.location.href;
        console.log(url);

        let slug: any;
        let uri: any;

        if(url.includes('localhost')){
            slug = this.route.snapshot.paramMap.get('slug');
            uri = this.route.snapshot.paramMap.get('uri');
        } else {

            let m;
            while ((m = regex.exec(url)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach((match, groupIndex) => {
                    console.log(`Found match, group ${groupIndex}: ${match}`);
                });
            }
            slug = 'thiaville';
            uri = 'tournoi-decembre-2021';

        }

        

        
        // get current organization & tournament
        this.organizationService.getOrganizationBySlug(slug).subscribe((data: any) => {
            if(data.length){
                this.organization = data[0];
                this.tournamentService.getTournamentByOrganizationAndUri(this.organization.id, uri).subscribe((data: any) => {
                    if(data.length){
                        this.tournament = data[0];
                        this.poolService.getPoolsByTournament(this.tournament.id).subscribe((data: any) => {
                            if(data.length){
                                this.pools = data;
                            }
                            this.ngxLoader.stopLoader('page-loader-registration');
                        })
                    }
                })
            }
        })

        this.addForm = new FormGroup({
            licenceNumber: new FormControl(
                this.licenceNumber, 
                [
                    Validators.required
                ]
            ),
            firstName: new FormControl(
                this.firstName, 
                [
                    Validators.required
                ]
            ),
            lastName: new FormControl(
                this.lastName, 
                [
                    Validators.required
                ]
            ),
            email: new FormControl(
                this.email, 
                [
                    Validators.required
                ]
            ),
            tournament: new FormControl(
                this.tournament,
                []
            ),
            selectedPools: new FormControl(
                this.selectedPools,
                [
                    Validators.required
                ]
            ),
            registrationID: new FormControl(
                this.registrationID,
                []
            ),
            payableAmount: new FormControl(
                this.payableAmount,
                []
            ),
            genre: new FormControl(
                this.genre, 
                []
            ),
            points: new FormControl(
                this.points, 
                []
            ),
            club: new FormControl(
                this.club, 
                []
            )
        });

    }

    ngOnInit(): void {

    }

    checkPool(pool:string, isChecked: boolean){
        if(isChecked) {
            this.selectedPools.push(pool);
        } else {
            let index = this.selectedPools.indexOf(pool);
            this.selectedPools.splice(index,1);
        }
        this.addForm.controls.selectedPools.setValue(this.selectedPools);
        let payableAmount = 0;
        this.addForm.value.selectedPools.map((selectedPool: any) => {
            const pool = this.pools.filter((el: any) => {
                return el.id === selectedPool.id
            })[0];
            payableAmount += pool.price;
        })
        this.payableAmount = payableAmount.toString();
        this.addForm.controls.payableAmount.setValue(this.payableAmount);

        // Test if is allowed on this pool
        this.selectedPools.map((pool: any) => {
            if(pool.minPoints > parseInt(this.addForm.value.points) || pool.maxPoints < parseInt(this.addForm.value.points)){
                this.addForm.get('selectedPools').errors = {};
                this.addForm.get('selectedPools').errors.invalid = true;
            }
        })


    }

    changeGenre(value: any){
        this.addForm.controls.genre.setValue(value);
    }

    testEmail(){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(String(this.addForm.value.email).toLowerCase())){
            this.addForm.get('email').errors = false;
        } else {
            this.addForm.get('email').errors = {};
            this.addForm.get('email').errors.invalid = true;
        }
    }

    fetchPlayerInfos(){
        let that = this;
        that.ffttService.getPlayerInfosByLicence(that.addForm.value.licenceNumber)
        .always(function (response) {
            that.fetching = true;
        })
        .done(function (response) {
            let data = that.ffttService.xml2json(response);
            if(data.liste.licence){
                that.addForm.get('licenceNumber').errors = false;
                that.addForm.controls.firstName.setValue(data.liste.licence.prenom);
                that.addForm.controls.lastName.setValue(data.liste.licence.nom);
                that.addForm.controls.points.setValue(data.liste.licence.point);
                that.addForm.controls.club.setValue(data.liste.licence.nomclub);
                let genre = data.liste.licence.sexe.toLowerCase();
                that.addForm.controls.genre.setValue(genre);
                let genreRadio = document.getElementById("genre-"+genre) as HTMLInputElement;
                genreRadio!.checked = true;

                // test by licence if user exists already or not
                that.userService.getUserByLicence(that.addForm.value.licenceNumber).subscribe(data => {
                    // test if registration exists
                    let response: any = data;
                    if(response.length){
                        that.service.getRegistrationsByTournamentAndUser(that.tournament.id, response[0].id).subscribe(data => {
                            if(data){
                                that.addForm.get('licenceNumber').errors = {};
                                that.addForm.get('licenceNumber').errors.alreadyRegistered = true;
                                //that.addForm.invalid = true;
                            }
                        })
                    }
                })

            } else {
                that.addForm.get('licenceNumber').errors = {};
                that.addForm.get('licenceNumber').errors.exist = true;
            }
            that.fetching = false;
        });
    }

    submitForm(){


        this.ngxLoader.startLoader('page-loader-registration');

        this.addForm.controls.tournament.setValue(this.tournament);
        let values = this.addForm.value;

        let user: any = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: Math.random().toString(36).slice(-8),
            licenceNumber: values.licenceNumber,
            points: values.points,
            genre: values.genre,
            club: values.club,
        }

        this.userService.createUser(user).subscribe(data => {
            let registration: any = {
                tournament: 'tournaments/' + values.tournament.id,
                pools: values.selectedPools.map((pool:any) => {
                    return 'pools/' + pool.id
                }),
                user: 'users/' + data.id,
                payableAmount: parseFloat(values.payableAmount),
                paidAmount: parseFloat('0'),
                presence: false,
                available: false,
                creator: 'users/1'
            }
            // create registration
            this.service.createRegistration(registration).subscribe(data => {
                this.registrationComplete = true;
                this.ngxLoader.stopLoader('page-loader-registration');
            })
        })

    }


}
