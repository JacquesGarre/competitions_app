import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faGem, faTrashAlt, faPencilAlt, faPlus, faSitemap, faObjectUngroup, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { TournamentService } from 'src/app/module-tournaments/tournament.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/module-users/user.service';
import { PoolService } from 'src/app/module-pools/pool.service';

@Component({
    selector: 'app-module-registrations-add-modal-form',
    templateUrl: './module-registrations-add-modal-form.component.html',
    styleUrls: ['./module-registrations-add-modal-form.component.css']
})
export class ModuleRegistrationsAddModalFormComponent {

    faSitemap = faSitemap;
    faObjectUngroup = faObjectUngroup;
    faClipboardList = faClipboardList;

    user: string = '';
    tournament: string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    addForm = new FormGroup({});
    currentUser: any;
    tournaments: any;
    pools: any;
    users: any;
    minPoints: string = '';
    maxPoints: string = '';
    price: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public tournamentService: TournamentService,
        public poolService: PoolService,
        public token: TokenStorageService,
        public userService: UserService
    ) { 
        this.addForm = new FormGroup({
            user: new FormControl(
                this.user, 
                [
                    Validators.required,
                    Validators.minLength(1)
                ]
            ),
            tournament: new FormControl(
                this.tournament, 
                [
                    Validators.required
                ]
            )
        });
        this.userService.getUsers().subscribe((data: any) => {
            this.users = data;
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
            })
            this.poolService.getPools().subscribe((data: any) => {
                this.pools = data;
            })
        })
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            user: '',
            tournament:''
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
