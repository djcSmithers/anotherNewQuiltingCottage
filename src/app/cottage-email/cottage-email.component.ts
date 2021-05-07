import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, } from "@angular/forms";
import { Subscription } from "rxjs";
import { EmailService } from "../email.service";
import { QuiltOrder } from "./cottage-email.model";

interface designIcon {
  value: string;
  viewValue: string;
  img: string;
}

@Component({
  selector: "app-cottage-email",
  templateUrl: "./cottage-email.component.html",
  styleUrls: ["./cottage-email.component.css"],
})
export class CottageEmailComponent implements OnInit {
  images = [];
  title = "nodeMailerApp";
  nodeMailerForm: FormGroup;
  // private imagesSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {

    this.images = [];

    fetch("http://localhost:3000/admin/gallery", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((result) => result.json())
      .then((res) => {
        this.images = res.images;
      });


    this.nodeMailerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      fabric: new FormControl(null, Validators.required),
      batting: new FormControl(null, Validators.required),
      width: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      design: new FormControl(null, Validators.required),
    });
  }

  sendMail() {
    alert("Email has been sent");

    let quiltOrder = new QuiltOrder(
      this.nodeMailerForm.value["name"],
      this.nodeMailerForm.value["email"],
      this.nodeMailerForm.value["phoneNumber"],
      this.nodeMailerForm.value["fabric"],
      this.nodeMailerForm.value["batting"],
      this.nodeMailerForm.value["width"],
      this.nodeMailerForm.value["date"],
      this.nodeMailerForm.value["design"]
      //Need to add the pattern selection to NodeMailer
    );

    // console.log(this.nodeMailerForm.value["design"]);

    // this.emailService.sendMessage(quiltOrder).subscribe(data=>{console.log(data);})

    fetch("http://localhost:3000/email/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(quiltOrder),
    }).then((response) => {
      console.log(response);
    });
  }

  // // Icon select
  // designIcons: designIcon[] = [
  //   {value: 'design-0', viewValue: 'bubbles' , img: '../assets/quiltDesigns/Bubbles.jpg'},
  //   {value: 'design-0', viewValue: 'meandering' , img: '../assets/quiltDesigns/meandering 1.jpg'}
  // ];

  // test(){
  //   // this.emailService.getFiles();liusdlgb
  //   this.images.forEach(e => {
  //     // console.log(e);
  //     console.log('../../assets/quiltDesigns/' + e.toString());
  //   });
  // }
}
