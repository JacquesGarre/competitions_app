import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent {

    @Input() title: any;
    @Input() confirmBtn: any;
    name: string = '';

    myForm = new FormGroup({});

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) { 
        this.myForm = new FormGroup({
            name: new FormControl(
                this.name, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            )
        });
    }

    private createForm() {
        this.myForm = this.formBuilder.group({
            name: ''
        });
    }

    public submitForm() {
        this.activeModal.close(this.myForm.value);
    }

}
