import { Relative } from "./relative.model";

export interface Customer {
    id: number,
    address: string;
    citizenshipNo: string;
    dateOfBirth: any;
    emailAddress: string;
    fullName: string;
    gender: string;
    firstName: string;
    lastName: string;
    maritalStatus: string;
    middleName: string;
    mobileNumber: string;
    customerStatus: string;
    relatives: Relative[]

}