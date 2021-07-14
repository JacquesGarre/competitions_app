import { DecimalPipe } from '@angular/common';
import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Organization } from './organization';
import { OrganizationService } from '../_services/organization.service';
import { NgbdSortableHeader, SortEvent } from '../_directives/sortable.directive';

import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-organizations',
    templateUrl: './module-organizations.component.html',
    styleUrls: ['./module-organizations.component.css'],
    providers: [OrganizationService, DecimalPipe]
})
export class ModuleOrganizationsComponent implements OnInit {

    faUsers = faUsers;

    organizations$: Observable<Organization[]>;
    total$: Observable<number>;
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    ngOnInit(): void {
    }

    constructor(public service: OrganizationService) {
        this.organizations$ = service.organizations$;
        this.total$ = service.total$;
        this.headers = new QueryList<NgbdSortableHeader>();
    }

    onSort({ column, direction }: any) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.service.sortColumn = column;
        this.service.sortDirection = direction;
    }

}
