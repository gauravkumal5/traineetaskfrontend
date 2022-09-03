import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { Relative } from '../models/relative.model';
import { CustomerService } from '../services/customer.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { MessageService } from '../services/message.service';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  updateUserForm!: FormGroup;
  isValidForm: boolean = true;
  user: Customer;
  erroMesssage: String = "";
  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router, private route: ActivatedRoute, private messageService: MessageService) {

  }

  ngOnInit(): void {

    let userId: number;
    this.route.queryParams.subscribe(params => {
      userId = params['userId'];
    });


    this.customerService.getCustomer(userId).subscribe((response) => {
      this.updateUserForm.patchValue(response);
      this.updateUserForm.controls["dateOfBirth"].setValue(formatDate(response.dateOfBirth, 'yyyy-MM-dd', 'en'));

      console.log(this.updateUserForm);
    },
      (error) => {
        this.erroMesssage = error;
        console.log(this.erroMesssage);
      })


    this.updateUserForm = this.fb.group({
      id: null,
      firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      middleName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      dateOfBirth: [null, [Validators.required]],
      status: ["active", [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      gender: ["male", [Validators.required]],
      citizenshipNo: ["", [Validators.required, Validators.pattern((/^[0-9-]*$/))]],
      address: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      maritalStatus: ["married", [Validators.required]],
      emailAddress: ["", [Validators.required, Validators.email]],
      mobileNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      addedBy: " ",
      addedDate: "",
      modifiedBy: " ",
      modifiedDate: " ",

      relatives: this.fb.array([
        this.fb.group({
          relationPersonName: ["ran", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["grandfather", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["dhan", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["father", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["mother", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),

        this.fb.group({
          relationPersonName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["spouse", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
      ])
    })

    this.updateUserForm.get('maritalStatus')?.valueChanges.subscribe(changes => {
      console.log(changes);
      if (changes === "single") {
        this.disableSpouseIfNotMarried(this.relatives.length - 1);
      }
      else {
        this.enableSpouseIfMarried(this.relatives.length - 1);
      }
    })

  }
  createRelatives(): FormGroup {
    return this.fb.group({
      relationPersonName: [null, Validators.required],
      relationship: [null, Validators.required]
    })
  }

  disableSpouseIfNotMarried(i: number) {
    this.relatives.controls[3].disable();
  }
  enableSpouseIfMarried(i: number) {
    this.relatives.controls[3].enable();
  }
  removeRelative(i: number) {
    this.relatives.removeAt(i);
  }


  get relatives(): FormArray {
    return <FormArray>this.updateUserForm.get('relatives');

  }
  addRelatives() {
    this.relatives.push(this.createRelatives());
  }


  onUpdateUser() {
    const postData: Customer = this.updateUserForm.value;
    console.log(postData);
    this.customerService.onUpdateCustomer(postData).subscribe((response) => {
      console.log(response);
      let message = "Customer Updated successfully";
      this.messageService.sendMessage({ text: message, category: 'success' });
      return this.router.navigate(["customers"]);
    },
      (error) => {
        this.erroMesssage = error.error;
        console.log(this.erroMesssage);

      })
  }

}

