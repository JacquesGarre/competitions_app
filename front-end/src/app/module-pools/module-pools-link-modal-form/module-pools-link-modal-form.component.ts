import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faSitemap, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { PoolService } from '../pool.service';
@Component({
    selector: 'app-module-pools-link-modal-form',
    templateUrl: './module-pools-link-modal-form.component.html',
    styleUrls: ['./module-pools-link-modal-form.component.css']
})
export class ModulePoolsLinkModalFormComponent {

    faSitemap = faSitemap;
    poolId: any = 0;
    addForm = new FormGroup({});
    pools: any = [];

    @Input() parentPoolIDS: any;

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public service: PoolService
    ) { 
        this.addForm = new FormGroup({
            poolId: new FormControl(
                this.poolId, 
                [
                    Validators.required
                ]
            )
        });

        this.service.getPools().subscribe((data: any) => {
            if (data.length) {
                this.pools = data.filter((pool: any) => !this.parentPoolIDS.includes(pool.id.toString()));
            }
        })

    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            poolId: 0
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
