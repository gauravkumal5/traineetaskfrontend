import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm!: FormGroup;
  isValidForm: boolean = true;
  isDiabledSpouse: boolean = true;

  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      firstName: ["gaurav", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      middleName: [""],
      lastName: ["kumal", [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern((/^[A-Za-z]+$/))]],
      dateOfBirth: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      gender: ["male", [Validators.required]],
      citizenshipNo: [null, [Validators.required, Validators.pattern((/^[0-9-]*$/))]],
      address: ["lazimpat", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      maritalStatus: [null, [Validators.required]],
      emailAddress: ["g@gmail.com", [Validators.required, Validators.email]],
      mobileNumber: ["9803937469", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      relatives: this.fb.array([
        this.fb.group({
          relationPersonName: ["dhan", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["father", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["gita", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["mother", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: ["ran", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: ["grandfather", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
        this.fb.group({
          relationPersonName: [{ value: '', disabled: this.isDiabledSpouse }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
          relationship: [{ value: 'spouse', disabled: this.isDiabledSpouse }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
        }),
      ])
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

    console.log(this.addUserForm);
    const postData: Customer = this.addUserForm.value;
    console.log(postData);
    this.customerService.onCreateCustomer(postData).subscribe((response) => {
      console.log(response);
      let message = "Customer Added successfully";
      this.messageService.sendMessage({ text: message, category: 'success' });
      this.router.navigate(["customers"]);
    },
      (error) => {
        console.log(error);
      })

  }
}