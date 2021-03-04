import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { RegistrationService } from './registration.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  registrationForm : FormGroup | any;

  get userName(){
    return this.registrationForm.controls.userName;
  }
  
  get email(){
    return this.registrationForm.controls.email;
  }

  // this for add dynamically input this alternate emails keywords
  get alternateEmails(){
    return this.registrationForm.controls.alternateEmails as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder, private _registrationService: RegistrationService){}

    ngOnInit(){
      this.registrationForm = this.fb.group({
        userName : ['', [Validators.required, Validators.minLength(4), forbiddenNameValidator(/password/)]], 
        password : [''],
        email : [''],
        subscribe : [false],
        confirmPassword : [''],
        address : this.fb.group({
          city : [''],
          state : [''],
          postalCode : ['']
        }),
        alternateEmails: this.fb.array([])
      }, {validator: PasswordValidator});

      this.registrationForm.get('subscribe').valueChanges
      .subscribe((checkedValue: any) => {
        const email = this.registrationForm.get('email');
        if(checkedValue){
          email.setValidators(Validators.required);  
        }else{
          email.clearValidators();
        }
        email.updateValueAndValidity();
      })
    }
    
  loadApiData(){
    this.registrationForm.patchValue({
      userName: 'Bruce',
      password: 'asd',
      confirmPassword: 'asd'
    });
  }

  // For Submitting the data on click button submit
  onSubmit(){
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('Success!', response),
        error => console.error('Error', error),
      )
  }
}
