import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Organization } from './organization';
import { OrganizationService } from './organization.service';
import { Router } from '@angular/router';

import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleOrganizationsAddModalFormComponent } from './module-organizations-add-modal-form/module-organizations-add-modal-form.component';


@Component({
    selector: 'app-module-organizations',
    templateUrl: './module-organizations.component.html',
    styleUrls: ['./module-organizations.component.css'],
    providers: [DatePipe]
})
export class ModuleOrganizationsComponent implements OnInit {

    faUsers = faUsers;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faPlus = faPlus;
    organizations: any = [];

    source: LocalDataSource;
    settings = {
        mode: 'inline',
        selectMode: 'multi',
        attr: {
            class: "table-hover"
        },
        actions: {
            columnTitle: "Actions",
            add: false,
            custom: [
                {
                    name: 'show',
                    title: '<i class="fa fa-eye mr-1" aria-hidden="true"></i>',
                }
            ],
        },
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false,
            },
            name: {
                title: 'Name',
                required: true
            },
            createdAt: {
                title: 'Created At',
                editable: false,
                addable: false,
                valuePrepareFunction: (createdAt: any) => {
                    if(createdAt.length){
                        return this.datePipe.transform(new Date(createdAt),'dd/MM/yyyy HH:mm');
                    } else {
                        return '';
                    }
                },
            },
            updatedAt: {
                title: 'Updated At',
                editable: false,
                addable: false,
                valuePrepareFunction: (updatedAt: any) => {
                    if(updatedAt.length){
                        return this.datePipe.transform(new Date(updatedAt),'dd/MM/yyyy HH:mm');
                    } else {
                        return '';
                    }
                },
            },
        },
        edit: {
            editButtonContent: '<i class="fa fa-pencil mr-2 ml-2" aria-hidden="true"></i>',
            saveButtonContent: '<i class="fa fa-check mr-2" aria-hidden="true"></i>',
            cancelButtonContent: '<i class="fa fa-times mr-2" aria-hidden="true"></i>',
            confirmSave: true
        },
        delete: {
            deleteButtonContent: '<i class="fa fa-trash mr-2" aria-hidden="true"></i>',
            confirmDelete: true
        },
        pager: {
            perPage: 50
        }
    };

    constructor(
        public service: OrganizationService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService
    ) {
        this.ngxLoader.startLoader('page-loader');
        this.source = new LocalDataSource();
        this.service.getOrganizations().subscribe((data: any) => {
            this.source.load(data);
            this.ngxLoader.stopLoader('page-loader');
        })
    }


    ngOnInit(): void {
    }

    // Create organization
    createOrganization() {
        const modalRef = this.modalService.open(ModuleOrganizationsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                let values = modalRef.componentInstance.addForm.value;
                let organization: any = {
                    name: values.name
                }
                this.service.createOrganization(organization).subscribe(data => {
                    this.service.getOrganizations().subscribe((data: any) => {
                        this.source.load(data);
                    })
                })
            }
        });
    }

    onEditConfirm(event: any) {
        event.confirm.resolve();
        let newData = {
            name: event.newData.name
        }
        this.service.updateOrganization(event.data.id, newData).subscribe(data => {
            this.service.getOrganizations().subscribe((data: any) => {
                this.source.load(data);
            })
        })
    }

    onDeleteConfirm(event: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting an organization';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + event.data.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                event.confirm.resolve();
                this.service.deleteOrganization(event.data.id).subscribe(data => {
                    this.service.getOrganizations().subscribe((data: any) => {
                        this.source.load(data);
                    })
                })
            }
        });
    }

    onCustomAction(event: any) {
        switch (event.action) {
          case 'show':
            this.router.navigate(['/admin/organizations/' + event.data.id])
            break;
        }
    }



}
