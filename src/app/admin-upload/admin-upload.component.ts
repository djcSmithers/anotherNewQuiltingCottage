import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-upload',
  templateUrl: './admin-upload.component.html',
  styleUrls: ['./admin-upload.component.scss']
})
export class AdminUploadComponent implements OnInit {

  imageForm: FormGroup;
  // imagePreview: string;

  imagePreview: string[];
  postData;


  // imageList: string[] = [];
  // files: FileList;
  
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.postData = new FormData();
    this.initForm();
  }

  private initForm(){
    this.imageForm = new FormGroup({
      'images': new FormControl(null, Validators.required)
    });
  }
  

onImagePicked(event: Event) {

  const files = (event.target as HTMLInputElement).files;
  const preview: string[] = [];
  let imageForm: FormGroup;
  imageForm = new FormGroup({
      'images': new FormControl(null, Validators.required)
    });

    //Go through each files picked, generate display URL
      let reader = new FileReader();  
      function readFile(index) {
        if( index >= files.length ) return;
        let file = files[index];
        reader.onload = function(e) {  
          // get file content  
          let bin = reader.result as string;
          // do sth with bin
          preview.push(bin);
          readFile(index+1)
        }
        reader.readAsDataURL(file);
      }
      readFile(0);

      //Set value of imageForm, preview
      imageForm.patchValue({images: files });
      this.imagePreview = preview;
      this.imageForm = imageForm;
} 

viewGallery(){
  this.router.navigate(['adminGallery']);
}

onSubmit(){
  let images = [];
  images = this.imageForm.value['images'];

for (let img of images){
  this.postData.append("images", img);
};

  const loginToken = sessionStorage.getItem('loginToken');

  fetch('http://localhost:3000/admin/images', {
      
      headers: {
        Authorization: 'Bearer ' + loginToken
      },
      method: 'POST',
      body: this.postData
  }).then(response => {
    if (response.status === 401){
      alert("Upload Failed, Please login");
      this.router.navigate(['login']);
    }
    if (response.status === 201){
    alert("Upload successful!");
    this.router.navigate(['adminGallery']);
    }
  })
  // .then(result => result.json() {

    // console.log(result);
    
    // console.log('Success:', result);
    // alert("Upload successful");
    // location.reload();
  // })
  .catch(error => {
    console.error('Error:', error);
  });

  
  // .then(result => {
  //     return result.json();
  // })
  // .then(data => {
  //     console.log(data);
  // })
  // .catch(err => {
  //     console.log(err);
  // })

}

}

/*
  // console.log(this.imageList);

  let image = new Image(this.imageList);

  // console.log(image);

  

  fetch('http://localhost:3000/admin/images', {
    method: 'POST',
    headers: {
      'enctype': 'multipart/form-data'
    },
  
})
.then(result => {
    return result.json();
})
.then(data => {
    // console.log(data);
    // productElement.remove();
})
.catch(err => {
    console.log(err);
})





  // this.images = this.imageForm.value['images'];
  // console.log(this.imageList);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   const strImages = JSON.stringify(this.imageList);

  //   this.http.post<{message: string}>('http://loclhost:3000/admin/images', strImages, {headers: headers});

  }
*/

