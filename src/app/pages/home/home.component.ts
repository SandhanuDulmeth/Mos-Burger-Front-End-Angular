import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
ngOnInit(): void {
  Swal.fire({
    imageUrl: "assets/Images/ControllerPanel/Offer01.png",
    imageWidth: 350,
    imageHeight: 300,
    imageAlt: "Custom image"
  });
}
}
