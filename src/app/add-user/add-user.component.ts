import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { MessageService } from '../services/message.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm!: FormGroup;
  isValidForm: boolean = true;
  isDiabledSpouse: boolean = true;
  isEmailUnique: boolean = true;
  isCitizenshipUnique: boolean = true;
  birthdayLimitDate: any;
  isSubmit: boolean = false;


  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router, private messageService: MessageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.birthdayLimitDate = new Date().setFullYear(new Date().getFullYear() - 5);
    this.addUserForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      middleName: [""],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      dateOfBirth: [null, [Validators.required]],
      status: ["active", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      gender: ["", [Validators.required]],
      citizenshipNo: [223423, [Validators.required, Validators.pattern((/^[0-9-]*$/))]],
      address: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      maritalStatus: ["", [Validators.required, Validators.minLength(3)]],
      emailAddress: ["", [Validators.required, Validators.email]],
      mobileNumber: ["9803937469", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      userLoginRequest: this.fb.group({
        username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        password: ["pass@123", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
      }),
      relatives: this.fb.array([
        this.fb.group({
          relationPersonName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["father", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["mother", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["grandfather", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: [{ value: '', disabled: this.isDiabledSpouse }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: [{ value: 'spouse', disabled: this.isDiabledSpouse }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
      ]),
    })

    this.addUserForm.get('maritalStatus')?.valueChanges.subscribe(changes => {
      console.log(changes);
      if (changes === "single") {
        this.disableSpouseIfNotMarried(this.relatives.length - 1);
      }
      else {
        this.enableSpouseIfMarried(this.relatives.length - 1);
      }
    })
  }

  disableSpouseIfNotMarried(i: number) {
    this.relatives.controls[i].setValue = null;
    this.relatives.controls[i].disable();
  }
  enableSpouseIfMarried(i: number) {
    this.relatives.controls[i].enable();
  }

  get relatives(): FormArray {
    return <FormArray>this.addUserForm.get('relatives');

  }
  onCreateUser() {
    Object.keys(this.addUserForm.controls).forEach(field => {
      const control = this.addUserForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    const form = this.relatives.controls;
    form.forEach((relative) => {
      Object.keys(form).forEach((i) => {
        const control = relative.get('relationship');
        const control2 = relative.get('relationPersonName');
        control.markAsTouched({ onlySelf: true });
        control2.markAsTouched({ onlySelf: true });
      });
    })

    if (this.addUserForm.invalid) {
      console.log(this.addUserForm);
      return;
    }
    const postData: Customer = this.addUserForm.value;
    console.log(postData);
    this.customerService.onCreateCustomer(postData).subscribe((response) => {
      console.log(response);
      let message = "Customer Added successfully";
      this.messageService.sendMessage({ text: message, category: 'success' });
      this.isSubmit = true;
      this.router.navigate(["customers"]);
    },
      (error) => {

        if (error.message === "Citizenship") {
          this.isEmailUnique = true;
          this.isCitizenshipUnique = false;
        }
        if (error.message === "Email") {
          this.isCitizenshipUnique = true;
          this.isEmailUnique = false;
        }
      })

  }
  logout() {
    this.authService.logout();
    this.authService.isAuthenticated().then((data) => {

      if (data) {
        return true;
      }
      else {
        this.router.navigate(['/login']);
        return false;

      }
    });
  }
  canExit() {

    if (!this.addUserForm.dirty) {
      return true;
    }
    else if (this.isSubmit) {
      return true;
    }
    else {
      if (window.confirm("All the changes will be lost. Ar you sure you wnat to continue?")) {
        return true;
      }
    }
    return false;

  }

}