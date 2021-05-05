import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isAuthenticated(){
    const token = localStorage.getItem("authToken");
    if(token){
      return true;
    }
    return false;
  }

  login(loginData){
    return this.http.post<any>('http://localhost:3000/auth/login',loginData);
   }
}
