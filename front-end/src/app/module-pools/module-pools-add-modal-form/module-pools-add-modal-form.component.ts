import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faGem, faTrashAlt, faPencilAlt, faPlus, faSitemap, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';
import { TournamentService } from 'src/app/module-tournaments/tournament.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/module-users/user.service';

@Component({
    selector: 'app-module-pools-add-modal-form',
    templateUrl: './module-pools-add-modal-form.component.html',
    styleUrls: ['./module-pools-add-modal-form.component.css']
})
export class ModulePoolsAddModalFormComponent {

    faSitemap = faSitemap;
    faObjectUngroup = faObjectUngroup;

    name: string = '';
    tournament: string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    addForm = new FormGroup({});
    currentUser: any;
    tournaments: any;
    minPoints: string = '';
    maxPoints: string = '';
    price: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public tournamentService: TournamentService,
        public token: TokenStorageService,
        public userService: UserService
    ) { 
        this.addForm = new FormGroup({
            name: new FormControl(
                this.name, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            ),
            tournament: new FormControl(
                this.tournament, 
                [
                    Validators.required
                ]
            ),
            startDate: new FormControl(
                this.startDate, 
                []
            ),
            endDate: new FormControl(
                this.endDate, 
                []
            ),
            minPoints: new FormControl(
                this.minPoints, 
                []
            ),
            maxPoints: new FormControl(
                this.maxPoints, 
                []
            ),
            price: new FormControl(
                this.price, 
                []
            )
        });
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
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            name: '',
            tournament:'',
            startDate: new Date(),
            endDate: new Date(),
            minPoints: '',
            maxPoints: '',
            price: '',
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
