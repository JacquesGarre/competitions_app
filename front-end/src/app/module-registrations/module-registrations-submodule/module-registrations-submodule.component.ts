import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { PoolService } from 'src/app/module-pools/pool.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';
import { Observable, throwError, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Env } from '../../_globals/env';

import { User } from '../../module-users/user';
import { Tournament } from '../../module-tournaments/tournament';
import { Pool } from '../../module-pools/pool';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes, faClipboardList, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';

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
    faSearch = faSearch;

    pools: any;
    users: any;
    currentUser: any;
    tournaments: any;

    licenceNumberFilter:any = '';
    tournamentFilter: any = '';
    poolsFilter: any = '';
    jerseyNumberFilter : any = '';
    presenceFilter:any = '';
    availableFilter:any = '';

    currentPage = 1;
    currentFilteredPage = 1;
    filteredPagination = false;
    pages = Array.from({length: 3}, (_, i) => i + 1);
    filteredPages = Array.from({length: 3}, (_, i) => i + 1);
    totalItems = 0;

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
        public poolService: PoolService,
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
        this.filteredPagination = false;

        this.initRegistrations();
    }

    initRegistrations() {

        this.ngxLoader.startLoader('submodule-loader-registrations');

        this.userService.getCurrentUser().subscribe((data: any) => {
            this.currentUser = data[0];
        })

        // Registrations as submodule in user
        if(this.parent.id && this.parentModule == 'users'){
            this.initAsUsersSubmodule();
        }

        // Registrations as submodule in pools
        if(this.parent.id && this.parentModule == 'pools'){
            this.initAsPoolsSubmodule();
        }

        // Registrations as submodule in tournaments
        if(this.parent.id && this.parentModule == 'tournaments'){
            this.initAsTournamentsSubmodule();
        }

        this.licenceNumberFilter = '';
        this.tournamentFilter = '';
        this.poolsFilter = '';
        this.jerseyNumberFilter = '';
        this.presenceFilter = '';
        this.availableFilter = '';

        // (<HTMLInputElement>document.getElementById("licenceNumberFilter")).value = '';
        // (<HTMLInputElement>document.getElementById("poolsFilter")).value = '';
        // (<HTMLInputElement>document.getElementById("jerseyNumberFilter")).value = '';
        // (<HTMLInputElement>document.getElementById("presenceFilter")).value = '';
        // (<HTMLInputElement>document.getElementById("availableFilter")).value = '';

    }

    initAsPoolsSubmodule(){

        this.service.getRegistrationsByPool(this.parent.id, this.currentPage).subscribe((data: any) => {

            this.registrations = data['hydra:member'];
            this.totalItems = data['hydra:totalItems'];
            this.pages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);

            // tournament ids
            let tournamentIDS = this.registrations.map((reg: any) => {
                return 'id[]=' + reg.tournament.replace('/tournaments/','');
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // user ids
            let userIDS = this.registrations.map((reg: any) => {
                let userID = reg.user.replace('/users/','');
                return 'id[]=' + userID;
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // pools ids
            let poolIDS: any = [];
            this.registrations.map((reg: any) => {
                reg.pools.map((pool:any) => {
                    poolIDS.push('id[]=' + pool.replace('/pools/',''));
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

                this.pools.map((pool: any) => {
                    pool.tournament = this.tournaments.filter((tournament: any) => {
                        return tournament.id == pool.tournament.replace('/tournaments/','')
                    })[0];
                });


                this.registrations.map((registration: any) => {
                    var tournament: any = this.tournaments.filter((tournament: any) => {
                        return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                    })[0]?.name
                    var user: any = this.users.filter((user: any) => {
                        return user.id.toString() == registration.user.replace('/users/','')
                    })[0];
                    var pools: any = this.pools.filter((pool: any) => {
                        return registration.pools.includes('/pools/'+pool.id.toString())
                    });
                    var poolsTxt: any = pools.map((pool: any) => {
                        return pool.name;
                    }).join(", ")

                    registration.user = user.firstName + ' ' + user.lastName
                    registration.licenceNumber = user.licenceNumber;
                    registration.pools = poolsTxt;
                    registration.tournament = tournament;

                })
                this.ngxLoader.stopLoader('submodule-loader-registrations');
            });
        })
    }


    initAsUsersSubmodule(){
        
        this.service.getRegistrationsByUser(this.parent.id, this.currentPage).subscribe((data: any) => {

            this.registrations = data['hydra:member'];
            this.totalItems = data['hydra:totalItems'];
            this.pages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);

            // tournament ids
            let tournamentIDS = this.registrations.map((reg: any) => {
                return 'id[]=' + reg.tournament.replace('/tournaments/','');
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // user ids
            let userIDS = this.registrations.map((reg: any) => {
                let userID = reg.user.replace('/users/','');
                return 'id[]=' + userID;
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // pools ids
            let poolIDS: any = [];
            this.registrations.map((reg: any) => {
                reg.pools.map((pool:any) => {
                    poolIDS.push('id[]=' + pool.replace('/pools/',''));
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
                this.pools.map((pool: any) => {
                    pool.tournament = this.tournaments.filter((tournament: any) => {
                        return tournament.id == pool.tournament.replace('/tournaments/','')
                    })[0];
                });


                this.registrations.map((registration: any) => {
                    var tournament: any = this.tournaments.filter((tournament: any) => {
                        return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                    })[0]?.name
                    var user: any = this.users.filter((user: any) => {
                        return user.id.toString() == registration.user.replace('/users/','')
                    })[0];
                    var pools: any = this.pools.filter((pool: any) => {
                        return registration.pools.includes('/pools/'+pool.id.toString())
                    });
                    var poolsTxt: any = pools.map((pool: any) => {
                        return pool.name;
                    }).join(", ")

                    registration.user = user.firstName + ' ' + user.lastName
                    registration.licenceNumber = user.licenceNumber;
                    registration.pools = poolsTxt;
                    registration.tournament = tournament;

                })
                this.ngxLoader.stopLoader('submodule-loader-registrations');
            });
        })
    }

    initAsTournamentsSubmodule(){

        this.service.getRegistrationsByTournament(this.parent.id, this.currentPage).subscribe((data: any) => {

            this.registrations = data['hydra:member'];
            this.totalItems = data['hydra:totalItems'];
            this.pages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);

            // tournament ids
            let tournamentIDS = this.registrations.map((reg: any) => {
                return 'id[]=' + reg.tournament.replace('/tournaments/','');
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // user ids
            let userIDS = this.registrations.map((reg: any) => {
                let userID = reg.user.replace('/users/','');
                return 'id[]=' + userID;
            }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // pools ids
            let poolIDS: any = [];
            this.registrations.map((reg: any) => {
                reg.pools.map((pool:any) => {
                    poolIDS.push('id[]=' + pool.replace('/pools/',''));
                });
            })
            poolIDS = poolIDS.filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')

            // get linked entities 
            let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json?'+tournamentIDS)
            let pools = this.http.get<Pool>(Env.API_URL + 'tournaments/'+ this.parent.id + '/pools.json')
            let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
            forkJoin([
                pools,
                users,
                tournaments
            ]).subscribe(results => {
                this.pools = results[0];
                this.users = results[1];
                this.tournaments = results[2];

                this.pools.map((pool: any) => {
                    pool.tournament = this.tournaments.filter((tournament: any) => {
                        return tournament.id == pool.tournament.replace('/tournaments/','')
                    })[0];
                });


                this.registrations.map((registration: any) => {
                    var tournament: any = this.tournaments.filter((tournament: any) => {
                        return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                    })[0]?.name
                    var user: any = this.users.filter((user: any) => {
                        return user.id.toString() == registration.user.replace('/users/','')
                    })[0];
                    var pools: any = this.pools.filter((pool: any) => {
                        return registration.pools.includes('/pools/'+pool.id.toString())
                    });
                    var poolsTxt: any = pools.map((pool: any) => {
                        return pool.name;
                    }).join(", ")

                    registration.user = user.firstName + ' ' + user.lastName
                    registration.licenceNumber = user.licenceNumber;
                    registration.pools = poolsTxt;
                    registration.tournament = tournament;

                })
                this.ngxLoader.stopLoader('submodule-loader-registrations');
            });
        })
    }

    goToPage(page: any): void {
        this.ngxLoader.startLoader('submodule-loader-registrations');
        this.currentPage = page;
        this.initRegistrations();
    }

    goToFilteredPage(page: any): void {
        this.ngxLoader.startLoader('submodule-loader-registrations');
        this.currentFilteredPage = page;
        this.filter(this.currentFilteredPage)
    }

    filter(page:any = this.currentFilteredPage) {


        // Registrations as submodule in pools
        if(this.parent.id && this.parentModule == 'pools'){
            this.filterAsPoolsSubmodule(page);
        }

        // Registrations as submodule in tournaments
        if(this.parent.id && this.parentModule == 'tournaments'){
            this.filterAsTournamentsSubmodule(page);
        }
    }

    filterAsPoolsSubmodule(page:any) {
        this.licenceNumberFilter = (<HTMLInputElement>document.getElementById("licenceNumberFilter")).value;
        this.tournamentFilter = '';
        this.poolsFilter = '/pools/'+this.parent.id;
        this.jerseyNumberFilter = (<HTMLInputElement>document.getElementById("jerseyNumberFilter")).value;
        this.presenceFilter = (<HTMLInputElement>document.getElementById("presenceFilter")).value;
        this.availableFilter = (<HTMLInputElement>document.getElementById("availableFilter")).value;

        // if(this.licenceNumberFilter.length < 1){
        //     this.licenceNumberFilter = false;
        // }
        // if(this.tournamentFilter.length < 1){
        //     this.tournamentFilter = false;
        // }
        // if(this.poolsFilter.length < 1){
        //     this.poolsFilter = false;
        // }
        // if(this.jerseyNumberFilter.length < 1){
        //     this.jerseyNumberFilter = false;
        // }
        // if(this.presenceFilter.length < 1){
        //     this.presenceFilter = false;
        // }
        // if(this.availableFilter.length < 1){
        //     this.availableFilter = false;
        // }

        this.filteredPagination = true;
        this.ngxLoader.startLoader('submodule-loader-registrations');

        let usersFilter:any = [];
        if(this.licenceNumberFilter){
            
            this.userService.getUserByLicence(this.licenceNumberFilter).subscribe((users: any) => {
                users.map((user:any) => {
                    usersFilter.push('/users/'+user.id);
                })
                this.service.getFilteredRegistrations(this.currentFilteredPage, usersFilter, this.jerseyNumberFilter, this.tournamentFilter, this.poolsFilter, this.presenceFilter, this.availableFilter).subscribe((data: any) => {
                    this.registrations = data['hydra:member'];
                    this.totalItems = data['hydra:totalItems'];
                    this.filteredPages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);
                    
        
                    // tournament ids
                    let tournamentIDS = this.registrations.map((reg: any) => {
                        return 'id[]=' + reg.tournament.replace('/tournaments/','');
                    }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
        
                    // user ids
                    let userIDS = this.registrations.map((reg: any) => {
                        let userID = reg.user.replace('/users/','');
                        return 'id[]=' + userID;
                    }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
        
        
                    // get linked entities 
                    let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
                    let pools = this.http.get<Pool>(Env.API_URL + 'pools.json?id[]='+this.parent.id)
                    let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
                    forkJoin([
                        pools,
                        users,
                        tournaments
                    ]).subscribe(results => {
                        this.pools = results[0];
                        this.users = results[1];
                        this.tournaments = results[2];
        
                        this.pools.map((pool: any) => {
                            pool.tournament = this.tournaments.filter((tournament: any) => {
                                return tournament.id == pool.tournament.replace('/tournaments/','')
                            })[0];
                        });
        
                        this.registrations.map((registration: any) => {
                            var tournament: any = this.tournaments.filter((tournament: any) => {
                                return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                            })[0]?.name
                            var user: any = this.users.filter((user: any) => {
                                return user.id.toString() == registration.user.replace('/users/','')
                            })[0];
                            var pools: any = this.pools.filter((pool: any) => {
                                return registration.pools.includes('/pools/'+pool.id.toString())
                            });
                            var poolsTxt: any = pools.map((pool: any) => {
                                return pool.name;
                            }).join(", ")
        
                            registration.user = user.firstName + ' ' + user.lastName
                            registration.licenceNumber = user.licenceNumber;
                            registration.pools = poolsTxt;
                            registration.tournament = tournament;
        
                        })
                        this.ngxLoader.stopLoader('submodule-loader-registrations');
                    });
                })
            })
        } else {
            this.service.getFilteredRegistrations(this.currentFilteredPage, usersFilter, this.jerseyNumberFilter, this.tournamentFilter, this.poolsFilter, this.presenceFilter, this.availableFilter).subscribe((data: any) => {
                this.registrations = data['hydra:member'];
                this.totalItems = data['hydra:totalItems'];
                this.filteredPages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);
                
    
                // tournament ids
                let tournamentIDS = this.registrations.map((reg: any) => {
                    return 'id[]=' + reg.tournament.replace('/tournaments/','');
                }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
    
                // user ids
                let userIDS = this.registrations.map((reg: any) => {
                    let userID = reg.user.replace('/users/','');
                    return 'id[]=' + userID;
                }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
    

    
                // get linked entities 
                let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
                let pools = this.http.get<Pool>(Env.API_URL + 'pools.json?id[]='+this.parent.id)
                let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
                forkJoin([
                    pools,
                    users,
                    tournaments
                ]).subscribe(results => {
                    this.pools = results[0];
                    this.users = results[1];
                    this.tournaments = results[2];
    
                    this.pools.map((pool: any) => {
                        pool.tournament = this.tournaments.filter((tournament: any) => {
                            return tournament.id == pool.tournament.replace('/tournaments/','')
                        })[0];
                    });
    
                    this.registrations.map((registration: any) => {
                        var tournament: any = this.tournaments.filter((tournament: any) => {
                            return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                        })[0]?.name
                        var user: any = this.users.filter((user: any) => {
                            return user.id.toString() == registration.user.replace('/users/','')
                        })[0];
                        var pools: any = this.pools.filter((pool: any) => {
                            return registration.pools.includes('/pools/'+pool.id.toString())
                        });
                        var poolsTxt: any = pools.map((pool: any) => {
                            return pool.name;
                        }).join(", ")
    
                        registration.user = user.firstName + ' ' + user.lastName
                        registration.licenceNumber = user.licenceNumber;
                        registration.pools = poolsTxt;
                        registration.tournament = tournament;
    
                    })
                    this.ngxLoader.stopLoader('submodule-loader-registrations');
                });
            })
        }

    }

    filterAsTournamentsSubmodule(page:any) {
        this.licenceNumberFilter = (<HTMLInputElement>document.getElementById("licenceNumberFilter")).value;
        this.tournamentFilter = '/tournaments/'+this.parent.id;
        this.poolsFilter = (<HTMLInputElement>document.getElementById("poolsFilter")).value;
        this.jerseyNumberFilter = (<HTMLInputElement>document.getElementById("jerseyNumberFilter")).value;
        this.presenceFilter = (<HTMLInputElement>document.getElementById("presenceFilter")).value;
        this.availableFilter = (<HTMLInputElement>document.getElementById("availableFilter")).value;

        // if(this.licenceNumberFilter.length < 1){
        //     this.licenceNumberFilter = false;
        // }
        // if(this.tournamentFilter.length < 1){
        //     this.tournamentFilter = false;
        // }
        // if(this.poolsFilter.length < 1){
        //     this.poolsFilter = false;
        // }
        // if(this.jerseyNumberFilter.length < 1){
        //     this.jerseyNumberFilter = false;
        // }
        // if(this.presenceFilter.length < 1){
        //     this.presenceFilter = false;
        // }
        // if(this.availableFilter.length < 1){
        //     this.availableFilter = false;
        // }

        this.filteredPagination = true;
        this.ngxLoader.startLoader('submodule-loader-registrations');

        let usersFilter:any = [];
        if(this.licenceNumberFilter){
            
            this.userService.getUserByLicence(this.licenceNumberFilter).subscribe((users: any) => {
                users.map((user:any) => {
                    usersFilter.push('/users/'+user.id);
                })
                this.service.getFilteredRegistrations(this.currentFilteredPage, usersFilter, this.jerseyNumberFilter, this.tournamentFilter, this.poolsFilter, this.presenceFilter, this.availableFilter).subscribe((data: any) => {
                    this.registrations = data['hydra:member'];
                    this.totalItems = data['hydra:totalItems'];
                    this.filteredPages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);
                    
        
                    // tournament ids
                    let tournamentIDS = this.registrations.map((reg: any) => {
                        return 'id[]=' + reg.tournament.replace('/tournaments/','');
                    }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
        
                    // user ids
                    let userIDS = this.registrations.map((reg: any) => {
                        let userID = reg.user.replace('/users/','');
                        return 'id[]=' + userID;
                    }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
        
                    // pools ids
                    let poolIDS: any = [];
                    this.registrations.map((reg: any) => {
                        reg.pools.map((pool:any) => {
                            poolIDS.push('id[]=' + pool.replace('/pools/',''));
                        });
                    })
                    poolIDS = poolIDS.filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
        
                    // get linked entities 
                    let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
                    let pools = this.http.get<Pool>(Env.API_URL +'tournaments/'+ this.parent.id + '/pools.json')
                    let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
                    forkJoin([
                        pools,
                        users,
                        tournaments
                    ]).subscribe(results => {
                        this.pools = results[0];
                        this.users = results[1];
                        this.tournaments = results[2];
        
                        this.pools.map((pool: any) => {
                            pool.tournament = this.tournaments.filter((tournament: any) => {
                                return tournament.id == pool.tournament.replace('/tournaments/','')
                            })[0];
                        });
        
                        this.registrations.map((registration: any) => {
                            var tournament: any = this.tournaments.filter((tournament: any) => {
                                return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                            })[0]?.name
                            var user: any = this.users.filter((user: any) => {
                                return user.id.toString() == registration.user.replace('/users/','')
                            })[0];
                            var pools: any = this.pools.filter((pool: any) => {
                                return registration.pools.includes('/pools/'+pool.id.toString())
                            });
                            var poolsTxt: any = pools.map((pool: any) => {
                                return pool.name;
                            }).join(", ")
        
                            registration.user = user.firstName + ' ' + user.lastName
                            registration.licenceNumber = user.licenceNumber;
                            registration.pools = poolsTxt;
                            registration.tournament = tournament;
        
                        })
                        this.ngxLoader.stopLoader('submodule-loader-registrations');
                    });
                })
            })
        } else {
            this.service.getFilteredRegistrations(this.currentFilteredPage, usersFilter, this.jerseyNumberFilter, this.tournamentFilter, this.poolsFilter, this.presenceFilter, this.availableFilter).subscribe((data: any) => {
                this.registrations = data['hydra:member'];
                this.totalItems = data['hydra:totalItems'];
                this.filteredPages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);
                
    
                // tournament ids
                let tournamentIDS = this.registrations.map((reg: any) => {
                    return 'id[]=' + reg.tournament.replace('/tournaments/','');
                }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
    
                // user ids
                let userIDS = this.registrations.map((reg: any) => {
                    let userID = reg.user.replace('/users/','');
                    return 'id[]=' + userID;
                }).filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
    
                // pools ids
                let poolIDS: any = [];
                this.registrations.map((reg: any) => {
                    reg.pools.map((pool:any) => {
                        poolIDS.push('id[]=' + pool.replace('/pools/',''));
                    });
                })
                poolIDS = poolIDS.filter((x: any, i: any, a: any) => a.indexOf(x) == i).join('&')
    
                // get linked entities 
                let tournaments = this.http.get<Tournament>(Env.API_URL + 'tournaments.json')
                let pools = this.http.get<Pool>(Env.API_URL +'tournaments/'+ this.parent.id + '/pools.json')
                let users = this.http.get<User>(Env.API_URL + 'users.json?'+userIDS)
                forkJoin([
                    pools,
                    users,
                    tournaments
                ]).subscribe(results => {
                    this.pools = results[0];
                    this.users = results[1];
                    this.tournaments = results[2];
    
                    this.pools.map((pool: any) => {
                        pool.tournament = this.tournaments.filter((tournament: any) => {
                            return tournament.id == pool.tournament.replace('/tournaments/','')
                        })[0];
                    });
    
                    this.registrations.map((registration: any) => {
                        var tournament: any = this.tournaments.filter((tournament: any) => {
                            return tournament.id.toString() == registration.tournament.replace('/tournaments/','')
                        })[0]?.name
                        var user: any = this.users.filter((user: any) => {
                            return user.id.toString() == registration.user.replace('/users/','')
                        })[0];
                        var pools: any = this.pools.filter((pool: any) => {
                            return registration.pools.includes('/pools/'+pool.id.toString())
                        });
                        var poolsTxt: any = pools.map((pool: any) => {
                            return pool.name;
                        }).join(", ")
    
                        registration.user = user.firstName + ' ' + user.lastName
                        registration.licenceNumber = user.licenceNumber;
                        registration.pools = poolsTxt;
                        registration.tournament = tournament;
    
                    })
                    this.ngxLoader.stopLoader('submodule-loader-registrations');
                });
            })
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
                    this.ngxLoader.startLoader('task-loader');
                    let values = modalRef.componentInstance.addForm.value;                    
                    let registration: any = {
                        tournament: 'tournaments/'+values.tournament,
                        user: 'users/'+this.parent.id,
                        payableAmount: parseFloat(values.payableAmount),
                        paidAmount: parseFloat(values.paidAmount),
                        creator: 'users/' + this.currentUser.id,
                        presence: values.presence == "1",
                        available: values.presence == "1",
                        pools: values.selectedPools.map((pool:any) => {
                            return '/pools/'+ pool.id
                        }),
                    }
                    this.service.createRegistration(registration).subscribe(data => {
                        this.initRegistrations();
                        this.ngxLoader.stopLoader('task-loader');
                    })
                }
            });
        }

        if(this.parentModule == 'pools'){
            modalRef.componentInstance.parentModule = 'pools';
            modalRef.componentInstance.parent = this.parent;
            this.poolService.getPoolsByTournament(this.parent.tournament.replace('/tournaments/', '')).subscribe((data: any) => {
                modalRef.componentInstance.pools = data;
                modalRef.componentInstance.addForm.controls.tournament.setValue(this.parent.tournament.replace('/tournaments/', ''));
                modalRef.componentInstance.tournament = this.parent.tournament.replace('/tournaments/', '');
            })


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
                                tournament: 'tournaments/' + values.tournament,
                                pools: values.selectedPools.map((pool:any) => {
                                    return 'pools/' + pool.id
                                }),
                                user: 'users/' + data.id,
                                payableAmount: parseFloat(values.payableAmount),
                                paidAmount: parseFloat(values.paidAmount),
                                presence: values.presence == "1",
                                available: values.presence == "1",
                                creator: 'users/' + this.currentUser.id
                            }
    
                            this.service.createRegistration(registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                            
                        })
    
                    } else {
    
                        let registration: any = {
                            tournament: 'tournaments/' + values.tournament,
                            pools: values.selectedPools.map((pool:any) => {
                                return 'pools/' + pool.id
                            }),
                            user: 'users/' + values.user,
                            payableAmount: parseFloat(values.payableAmount),
                            paidAmount: parseFloat(values.paidAmount),
                            presence: values.presence == "1",
                            available: values.presence == "1",
                            creator: 'users/' + this.currentUser.id
                        }
        
                        // registration exists, we update it
                        if(values.registrationID !== ""){
                            this.service.updateRegistration(values.registrationID, registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                        // else we create it
                        } else {
                            this.service.createRegistration(registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                        }
    
                    }
                    
                }
            });
        }

        if(this.parentModule == 'tournaments'){
            this.poolService.getPoolsByTournament(this.parent.id).subscribe((data: any) => {
                modalRef.componentInstance.pools = data;
            })
            modalRef.componentInstance.addForm.controls.tournament.setValue(this.parent.id);
            modalRef.componentInstance.tournament = this.parent.id;
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
                                tournament: 'tournaments/' + this.parent.id,
                                pools: values.selectedPools.map((pool:any) => {
                                    return 'pools/' + pool.id
                                }),
                                user: 'users/' + data.id,
                                payableAmount: parseFloat(values.payableAmount),
                                paidAmount: parseFloat(values.paidAmount),
                                presence: values.presence == "1",
                                available: values.presence == "1",
                                creator: 'users/' + this.currentUser.id
                            }
    
                            this.service.createRegistration(registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                            
                        })
    
                    } else {
    
                        let registration: any = {
                            tournament: 'tournaments/' + this.parent.id,
                            pools: values.selectedPools.map((pool:any) => {
                                return 'pools/' + pool.id
                            }),
                            user: 'users/' + values.user,
                            payableAmount: parseFloat(values.payableAmount),
                            paidAmount: parseFloat(values.paidAmount),
                            presence: values.presence == "1",
                            available: values.presence == "1",
                            creator: 'users/' + this.currentUser.id
                        }
        
                        // registration exists, we update it
                        if(values.registrationID !== ""){
                            this.service.updateRegistration(values.registrationID, registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                        // else we create it
                        } else {
                            this.service.createRegistration(registration).subscribe(data => {
                                this.initRegistrations();
                                this.ngxLoader.stopLoader('task-loader');
                            })
                        }
    
                    }
                }
            });
        }

    }

    // Delete registration
    deleteRegistration(registration: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppresion d\'une inscription';
        modalRef.componentInstance.content = 'Êtes-vous sûr de vouloir supprimer cette inscription?';
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
