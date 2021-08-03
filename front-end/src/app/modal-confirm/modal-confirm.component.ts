import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent {

    faCheck = faCheck;
    faTimes = faTimes;

    @Input() title: any;
    @Input() content: any;
    @Input() confirmBtn: any;

    constructor(public activeModal: NgbActiveModal) { }

}
