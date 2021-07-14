import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Organization } from '../module-organizations/organization';
import { Env } from '../_globals/env';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../_directives/sortable.directive';

interface SearchResult {
    organizations: Organization[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(organizations: Organization[], column: SortColumn, direction: string): Organization[] {
    if (direction === '' || column === '') {
        return organizations;
    } else {
        return [...organizations].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(organization: Organization, term: string, pipe: PipeTransform) {
    return organization.name.toLowerCase().includes(term.toLowerCase());
    // || pipe.transform(organization.area).includes(term)
    // || pipe.transform(organization.population).includes(term);
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _organizations$ = new BehaviorSubject<Organization[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };


    ORGANIZATIONS: Organization[] = [
        {
            id: 1,
            name: 'Russia',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            name: 'France',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 3,
            name: 'Spain',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 4,
            name: 'Italy',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 5,
            name: 'Brazil',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 6,
            name: 'Maroc',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]


    constructor(private pipe: DecimalPipe, private http: HttpClient) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._organizations$.next(result.organizations);
            this._total$.next(result.total);
        });

        this._search$.next();
    }

    // getOrganizations(): Observable<any> {
    //     return this.http.get(Env.API_URL + 'organizations');
    // }

    get organizations$() { return this._organizations$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        let organizations = sort(this.ORGANIZATIONS, sortColumn, sortDirection);

        // 2. filter
        organizations = organizations.filter(organization => matches(organization, searchTerm, this.pipe));
        const total = organizations.length;

        // 3. paginate
        organizations = organizations.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ organizations, total });
    }
}