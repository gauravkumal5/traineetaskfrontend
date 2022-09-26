import { Relative } from "./relative.model";
import { UserLogin } from "./user-login.model";

export interface Customer {
    id: number,
    address: string;
    citizenshipNo: string;
    dateOfBirth: any;
    emailAddress: string;
    gender: string;
    maritalStatus: string;
    mobileNumber: string;
    customerStatus: string;
    adderName: string;
    customerLastName: string;
    customerMiddleName: string;
    customerName: string;
    modifierName: String;
    relatives: Relative[],
    userLoginRequest: UserLogin,
    userLoginDetailResponse: UserLogin

}