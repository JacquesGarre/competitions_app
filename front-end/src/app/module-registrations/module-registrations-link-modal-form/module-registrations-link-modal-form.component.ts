import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faGem, faTrashAlt, faPencilAlt, faPlus, faSitemap, faObjectUngroup, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { TournamentService } from 'src/app/module-tournaments/tournament.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/module-users/user.service';
import { PoolService } from 'src/app/module-pools/pool.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RegistrationService } from '../registration.service';
import { FFTTService } from 'src/app/_services/fftt.service';

@Component({
    selector: 'app-module-registrations-link-modal-form',
    templateUrl: './module-registrations-link-modal-form.component.html',
    styleUrls: ['./module-registrations-link-modal-form.component.css']
})
export class ModuleRegistrationsLinkModalFormComponent {

    faSitemap = faSitemap;
    faObjectUngroup = faObjectUngroup;
    faClipboardList = faClipboardList;

    user: any;
    tournament: any;
    selectedPools: any = [];
    creationMode: string = 'existingUser';
    startDate: Date = new Date();
    endDate: Date = new Date();
    addForm = new FormGroup({});
    currentUser: any;
    selectedUser: any;
    tournaments: any;
    payableAmount: any;
    paidAmount: any;
    presence: string = '0';
    registrationID: any; 
    pools: any;
    users: any;
    displayUserDetails: boolean = false;
    email: string = '';
    firstName: string = '';
    lastName: string = '';
    password: string = '';
    licenceNumber: string = '';
    points: string = '';
    genre: string = '';
    club: string = '';
    fetching: boolean = false;
    parentModule: string='';
    parent: any;

    dropdownSettings: IDropdownSettings = {};

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public tournamentService: TournamentService,
        public service: RegistrationService,
        public poolService: PoolService,
        public token: TokenStorageService,
        public userService: UserService,
        public ffttService: FFTTService
    ) {
        this.addForm = new FormGroup({
            tournament: new FormControl(
                this.tournament,
                [
                    Validators.required
                ]
            ),
            selectedPools: new FormControl(
                this.selectedPools,
                [
                    Validators.required
                ]
            ),
            creationMode: new FormControl(
                this.creationMode,
                [
                    Validators.required
                ]
            ),
            user: new FormControl(
                this.user,
                []
            ),
            registrationID: new FormControl(
                this.registrationID,
                []
            ),
            presence: new FormControl(
                this.presence,
                []
            ),
            payableAmount: new FormControl(
                this.payableAmount,
                []
            ),
            paidAmount: new FormControl(
                this.paidAmount,
                []
            ),
            licenceNumber: new FormControl(
                this.licenceNumber, 
                []
            ),
            points: new FormControl(
                this.points, 
                []
            ),
            genre: new FormControl(
                this.genre, 
                []
            ),
            club: new FormControl(
                this.club, 
                []
            ),
            email: new FormControl(
                this.email, 
                []
            ),
            firstName: new FormControl(
                this.firstName, 
                []
            ),
            lastName: new FormControl(
                this.lastName, 
                []
            ),
            password: new FormControl(
                this.password, 
                []
            )
        });

        this.userService.getUsers().subscribe((data: any) => {
            this.users = data['hydra:member'];
        })

        this.userService.getCurrentUser().subscribe((data: any) => {
            this.currentUser = data[0];
            if (this.currentUser.roles.includes('ROLE_ADMIN')) {
                this.tournamentService.getTournaments().subscribe((data: any) => {
                    this.tournaments = data;
                })
            } else {
                this.tournamentService.getTournamentsByUser(this.currentUser.id).subscribe((data: any) => {
                    this.tournaments = data;
                })
            }
        })

        this.selectedPools = [];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'displayTitle',
            selectAllText: 'Select All',
            enableCheckAll: false,
            unSelectAllText: 'Unselect All',
            itemsShowLimit: 30,
            allowSearchFilter: true
        };



    }

    ngOnInit(): void {

        if(this.parentModule == 'tournaments'){
            this.poolService.getPoolsByTournament(this.tournament).subscribe((data: any) => {
                this.pools = data;
                this.pools.map((pool:any) => {
                    pool.displayTitle = pool.name + '(de '+pool.minPoints+' à '+pool.maxPoints+')';
                })
            })
        }

        if(this.parentModule == 'pools'){
            this.poolService.getPoolsByTournament(this.parent.tournament.replace('/api/tournaments/','')).subscribe((data: any) => {
                this.pools = data;
                this.pools.map((pool:any) => {
                    pool.displayTitle = pool.name + '(de '+pool.minPoints+' à '+pool.maxPoints+')';
                })
                this.addForm.controls.selectedPools.setValue([{
                    id:this.parent.id,
                    name:this.parent.name,
                    displayTitle:this.parent.name + '(de '+this.parent.minPoints+' à '+this.parent.maxPoints+')'
                }]);
                this.calculatePayableAmount();
            })

        }
        
        if(this.parentModule !== 'users'){
            this.addForm.controls.creationMode.setValue('newUser');
        } else {
            this.addForm.controls.creationMode.setValue('existingUser');
            this.addForm.controls.user.setValue(this.parent);
            this.displayUserDetails = false;
        }
    }



    onItemSelect(item: any) {
        this.calculatePayableAmount();
    }

    calculatePayableAmount(){
        let payableAmount = 0;
        this.addForm.value.selectedPools.map((selectedPool: any) => {
            const pool = this.pools.filter((el: any) => {
                return el.id === selectedPool.id
            })[0];
            payableAmount += pool.price;
        })
        this.payableAmount = payableAmount.toString();
        this.addForm.controls.payableAmount.setValue(this.payableAmount);
    }

    onSelectAll(item: any) {
        this.calculatePayableAmount();
    }

    fetchPlayerInfos(){
        let that = this;
        that.ffttService.getPlayerInfosByLicence(that.addForm.value.licenceNumber)
        .always(function (response) {
            that.fetching = true;
        })
        .done(function (response) {
            let data = that.ffttService.xml2json(response);
            console.log(data)
            if(data.liste.licence){
                that.addForm.controls.firstName.setValue(data.liste.licence.prenom);
                that.addForm.controls.lastName.setValue(data.liste.licence.nom);
                that.addForm.controls.points.setValue(data.liste.licence.point);
                that.addForm.controls.club.setValue(data.liste.licence.nomclub);
                that.addForm.controls.genre.setValue(data.liste.licence.sexe.toLowerCase());
            } else {
                that.addForm.controls.firstName.setValue("");
                that.addForm.controls.lastName.setValue("");
                that.addForm.controls.points.setValue("");
                that.addForm.controls.club.setValue("");
                that.addForm.controls.genre.setValue("");
            }
            that.fetching = false;
        });
    }


    tournamentChanged(): void {
        // Si tournament n'est pas vide, on display les tableaux du tournoi
        if (this.addForm.value.tournament.length && this.addForm.value.tournament !== this.tournament) {
            this.tournament = this.addForm.value.tournament;
            this.poolService.getPoolsByTournament(this.addForm.value.tournament).subscribe((data: any) => {
                this.pools = data;
                this.pools.map((pool:any) => {
                    pool.displayTitle = pool.name + '(de '+pool.minPoints+' à '+pool.maxPoints+')';
                })
            })
        }
    }


    userChanged(): void {

        if(this.addForm.value.creationMode == 'newUser'){
            this.addForm.controls.user.setValue("");
            this.addForm.controls.registrationID.setValue("");
            this.addForm.controls.presence.setValue("0");
            this.addForm.controls.selectedPools.setValue([]);
            this.addForm.controls.payableAmount.setValue("0");
            this.addForm.controls.paidAmount.setValue("");
        } else {

            // Si creationMode n'est pas vide, on display les users
            if (this.addForm.value.user.length) {
                this.selectedUser = this.users.filter((el: any) => {
                    return el.id === this.addForm.value.user.id
                })[0];
            }

            // Check si une registration existe deja pour ce user / ce tournoi. Si oui, remplir auto les champs
            this.service.getRegistrationsByTournamentAndUser(this.addForm.value.tournament, this.addForm.value.user).subscribe((data: any) => {

                this.addForm.controls.registrationID.setValue("");
                this.addForm.controls.presence.setValue("0");
                this.addForm.controls.selectedPools.setValue([]);
                this.addForm.controls.payableAmount.setValue("0");
                this.addForm.controls.paidAmount.setValue("");

                // Si l'user a une inscription à ce tournoi, fill les champs
                if(data.length){
                    let existingRegistration = data[0];
                    let pools = existingRegistration.pools.map((pool: any) => {
                        const existingPool = this.pools.filter((el: any) => {
                            return el.id.toString() === pool.replace('/api/pools/','')
                        })[0];
                        return {
                            id: existingPool.id,
                            name: existingPool.name                
                        }
                    }) 
                    this.addForm.controls.presence.setValue(existingRegistration.presence ? "1" : "0");
                    this.addForm.controls.selectedPools.setValue(pools);
                    this.addForm.controls.payableAmount.setValue(existingRegistration.payableAmount);
                    this.addForm.controls.paidAmount.setValue(existingRegistration.paidAmount);
                    this.addForm.controls.registrationID.setValue(existingRegistration.id);
                }

                this.displayUserDetails = true;

            })

        }


    }



    public submitForm() {
        
        this.calculatePayableAmount();
        console.log(this.addForm.value);
        this.activeModal.close(this.addForm.value);
    }

}
