import { Component, OnInit } from '@angular/core';
// import {Apollo, gql} from 'apollo-angular';
import {FormGroup,FormControl,Validators,FormArray} from '@angular/forms';
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  email:string;
  password:string;
  SigninForm:FormGroup;
  serverAuth:boolean = false;
  serverCallDone:boolean=false;
  serverMessage:string;
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    const token = localStorage.getItem("authToken");

    if(token){
    //   this.router.navigate(['/dashboard']);
    }
    this.SigninForm = new FormGroup({
      'email' : new FormControl("",[Validators.required]),
      'password': new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(12)])
    })
    
  }

  onSubmit(){
    console.log(this.SigninForm.value);
    const authData = {
      email:this.SigninForm.value.email,
      password:this.SigninForm.value.password
    }
    this.auth.login(authData).subscribe(_resp => {
      console.log("REsponse",_resp)
      const isAuth= _resp.auth;
      const authtoken = _resp.token;
      if(isAuth){
       localStorage.setItem("authToken", authtoken);
       this.router.navigate(['/dashboard']);
     // window.location.reload(); 
      }else{
        this.serverAuth = false;
        this.serverCallDone = true;
        this.serverMessage = _resp.message;
      }
    });
  }

}
