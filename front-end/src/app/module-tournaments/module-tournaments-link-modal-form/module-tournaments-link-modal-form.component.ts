import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faSitemap, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TournamentService } from '../tournament.service';
@Component({
    selector: 'app-module-tournaments-link-modal-form',
    templateUrl: './module-tournaments-link-modal-form.component.html',
    styleUrls: ['./module-tournaments-link-modal-form.component.css']
})
export class ModuleTournamentsLinkModalFormComponent {

    faSitemap = faSitemap;
    tournamentId: any = 0;
    addForm = new FormGroup({});
    tournaments: any = [];

    @Input() parentTournamentIDS: any;

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public service: TournamentService
    ) { 
        this.addForm = new FormGroup({
            tournamentId: new FormControl(
                this.tournamentId, 
                [
                    Validators.required
                ]
            )
        });

        this.service.getTournaments().subscribe((data: any) => {
            if (data.length) {
                this.tournaments = data.filter((tournament: any) => !this.parentTournamentIDS.includes(tournament.id.toString()));
            }
        })

    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            tournamentId: 0
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
