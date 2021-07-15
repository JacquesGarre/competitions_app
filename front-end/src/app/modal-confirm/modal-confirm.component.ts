import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent {

    @Input() title: any;
    @Input() content: any;
    @Input() confirmBtn: any;

    constructor(public activeModal: NgbActiveModal) { }

}
