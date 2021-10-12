import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
@Component({
    selector: 'app-module-users-link-modal-form',
    templateUrl: './module-users-link-modal-form.component.html',
    styleUrls: ['./module-users-link-modal-form.component.css']
})
export class ModuleUsersLinkModalFormComponent {

    faUsers = faUsers;
    userId: number = 0;
    addForm = new FormGroup({});
    users: any = [];

    @Input() parentUserIDS: any;

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public service: UserService
    ) { 
        this.addForm = new FormGroup({
            userId: new FormControl(
                this.userId, 
                [
                    Validators.required,
                    Validators.minLength(1)
                ]
            )
        });
        this.service.getUsers().subscribe((data: any) => {
            if (data.length) {
                this.users = data.filter((user: any) => !this.parentUserIDS.includes(user.id.toString()));
            }
        })
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            userId: 0
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
