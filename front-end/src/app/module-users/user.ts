import { Organization } from "../module-organizations/organization";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    organizations: Organization[];
    createdAt: Date;
    updatedAt: Date;
    password: string;
    licenceNumber: string;
    points: string;
    club: string;
    genre: string;
}