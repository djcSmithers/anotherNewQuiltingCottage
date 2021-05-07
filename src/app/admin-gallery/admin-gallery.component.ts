import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Image } from "./image.model";

@Component({
  selector: "app-admin-gallery",
  templateUrl: "./admin-gallery.component.html",
  styleUrls: ["./admin-gallery.component.scss"],
})
export class AdminGalleryComponent implements OnInit {
  loginToken = sessionStorage.getItem("loginToken");
  images = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.images = [];
    if (!this.loginToken) {
      this.router.navigate(["login"]);
    }

    fetch("http://localhost:3000/admin/gallery", {
      headers: {
        Authorization: "Bearer " + this.loginToken,
      },
      method: "GET",
    })
      .then((result) => result.json())
      .then((res) => {
        // console.log(res);
        this.images = res.images;
      });
  }

  onDeleteImage(image) {
    let confirmation = window.confirm("Delete " + image.imageName + "?");

    if (confirmation) {
      let id = image._id;

      if (!this.loginToken) {
        this.router.navigate(["login"]);
      }

      fetch("http://localhost:3000/admin/delete/" + id, {
        headers: {
          Authorization: "Bearer " + this.loginToken,
        },
        method: "DELETE",
      })
        .then((result) => result.json())
        .then((res) => {

          if (res.status === 401){
            alert("Upload Failed, Please login");
            this.router.navigate(['login']);
          }

          // console.log(res);
          // console.log(res.imageSelected[0].imageName);
          alert("File deleted successfully");
          this.loadImages();
        });
    }
  }

  uploadFiles() {
    this.router.navigate(["upload"]);
  }
}
