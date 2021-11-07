import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { UserService } from '../../module-users/user.service';
import { faUser, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faSitemap, faAlignLeft, faCog, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TournamentService } from 'src/app/module-tournaments/tournament.service';
import { PoolService } from 'src/app/module-pools/pool.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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
    faClipboardList = faClipboardList;

    dropdownSettings: IDropdownSettings = {};

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
        description: '',
        pools: []
    };
    untouchedRegistration: any;
    public isReadonly: boolean = true;
    users: any;
    title: any;
    currentUser: any;
    tournaments: any;
    startDate: any;
    endDate: any;
    selectedPools: any;
    pools: any;
    payableAmount: any;

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
        description: '',
        pools: []
    };

    constructor(
        public service: RegistrationService,
        public userService: UserService,
        public tournamentService: TournamentService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService,
        private poolService: PoolService
    ){
        this.ngxLoader.startLoader('page-loader');
        this.startDate = new Date();
        this.endDate = new Date();
        
        this.selectedPools = [];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 15,
            allowSearchFilter: true
        };


    }

    ngOnInit(): void {
        this.initRegistration();
    }


    initRegistration(){
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getRegistration(id).subscribe((data: any) => {
            this.registration = data;

            this.startDate = this.registration.startDate;
            this.endDate = this.registration.endDate;

            this.untouchedRegistration = this.registration;
            this.form = this.registration;
            this.form.presence = this.registration.presence ? "1" : "0";
            this.form.available = this.registration.available ? "1" : "0";
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
                    let user = this.users.filter((user: any) => {
                        return this.form.user.replace('/api/users/','') == user.id.toString()
                    })[0];
                    this.title = user.firstName + ' ' + user.lastName
                    this.ngxLoader.stopLoader('page-loader');
                })
            })
            this.poolService.getPoolsByTournament(this.registration.tournament.replace('/api/tournaments/','')).subscribe((data: any) => {
                this.pools = data;
                this.form.pools = this.registration.pools.map((pool: any) => {
                    const existingPool = this.pools.filter((el: any) => {
                        return el.id.toString() === pool.replace('/api/pools/','')
                    })[0];
                    return {
                        id: existingPool.id,
                        name: existingPool.name.replace('/api/pools/','')                
                    }
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

    onItemSelect(item: any) {
        this.calculatePayableAmount();
    }

    calculatePayableAmount(){
        let payableAmount = 0;
        this.form.pools.map((selectedPool: any) => {
            const pool = this.pools.filter((el: any) => {
                return el.id === selectedPool.id
            })[0];
            payableAmount += pool.price;
        })
        this.form.payableAmount = payableAmount.toString();
    }

    onSelectAll(item: any) {
        this.calculatePayableAmount();
    }

    onSubmit() {
        this.ngxLoader.startLoader('task-loader');
        const updatedRegistration = {
            tournament: this.form.tournament,
            user: this.form.user,
            pools: this.form.pools.map((pool: any) => {
                return '/api/pools/'+pool.id
            }),
            payableAmount: parseFloat(this.form.payableAmount),
            paidAmount: parseFloat(this.form.paidAmount),
            presence: this.form.presence == "1",
            available: this.form.available == "1",
        }
        this.service.updateRegistration(this.registration.id, updatedRegistration).subscribe((data: any) => {
            this.registration = data;
            this.form = data;
            this.form.pools = this.registration.pools.map((pool: any) => {
                const existingPool = this.pools.filter((el: any) => {
                    return el.id.toString() === pool.replace('/api/pools/','')
                })[0];
                return {
                    id: existingPool.id,
                    name: existingPool.name.replace('/api/pools/','')                
                }
            }) 
            this.form.presence = this.registration.presence ? "1" : "0";
            this.form.available = this.registration.available ? "1" : "0";
            let user = this.users.filter((user: any) => {
                return this.form.user.replace('/api/users/','') == user.id.toString()
            })[0];
            this.title = user.firstName + ' ' + user.lastName
            this.ngxLoader.stopLoader('task-loader');
        })
        this.toggleForm()
    }

}
