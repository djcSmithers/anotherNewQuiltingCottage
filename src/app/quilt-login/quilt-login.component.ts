import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './users.model';

@Component({
  selector: 'app-quilt-login',
  templateUrl: './quilt-login.component.html',
  styleUrls: ['./quilt-login.component.scss']
})
export class QuiltLoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
  }

  
  private initForm(){
    this.loginForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onSubmit(){

    let user = new User(
      this.loginForm.value['username'],
      this.loginForm.value['password']
    );

    fetch('http://localhost:3000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
  })
  .then(result => {
      return result.json();
  })
  .then(data => {
      // console.log(data);
      // sessionStorage.setItem('loginToken', JSON.stringify(data));
      sessionStorage.setItem('loginToken', data.token);
      this.router.navigate(['upload']);
  })
  .catch(err => {
      console.log(err);
  })
};



    /*
    let user = new User(
      this.loginForm.value['username'],
      this.loginForm.value['password']
    );

    console.log(user);


    fetch('http://localhost:3000/admin/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
  })
  .then(result => {
      return result.json();
  })
  .then(data => {
      console.log(data);
      // productElement.remove();
  })
  .catch(err => {
      console.log(err);
  })
*/

/*
    let newUser = new User(this.loginForm.value['username'], this.loginForm.value['password']);

    let strUser = JSON.stringify(newUser);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

  try{
    await this.http.post<{message: string}>('http://loclhost:3000/admin/login', strUser, {headers: headers});
  } catch{
}
*/

}
