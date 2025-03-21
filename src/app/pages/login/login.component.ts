import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../auth.service'; // Adjust the path as needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isResetTrue: boolean = false;
  resetCode: string = '';
  newPassword: string = '';
  currentTime: string = '';

  loginDisabled: boolean = true;
  resetPasswordDisabled: boolean = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
  }

  onLogin() {
    if (!this.email.endsWith("@gmail.com")) {
      Swal.fire("Please enter a valid Gmail address");
      return;
    }

    fetch("http://localhost:8080/AdminController/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.password }),
    })
      .then((response) => response.text())
      .then((result) => {
        if (result === "true") {
       
          this.authService.login();

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Success",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => this.router.navigate(['/home']), 2000);
        } else {
          Swal.fire("Invalid email or password");
        }
      })
      .catch((error) => console.error(error));
  }

  getResetCode() {
    if (!this.email.endsWith("@gmail.com")) {
      Swal.fire("Please enter a valid Gmail address");
      return;
    }

    fetch("http://localhost:8080/api/auth/sendOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email }),
    })
      .then((response) => response.text())
      .then((result) => {
        this.isResetTrue = result === "true";
        Swal.fire(result === "true" ? "OTP Sent Successfully" : "Failed to send OTP");
      })
      .catch((error) => console.error(error));
  }

  resetPassword() {
    if (!this.email.endsWith("@gmail.com")) {
      Swal.fire("Please enter a valid Gmail address");
      return;
    }
    if (this.resetCode.trim() === "" || this.newPassword.trim() === "") {
      Swal.fire("Please enter a valid reset code and new password");
      return;
    }

    fetch("http://localhost:8080/api/auth/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, otp: this.resetCode, newPassword: this.newPassword }),
    })
      .then((response) => response.json())
      .then((result: boolean) => {
        Swal.fire(result ? "Password Reset Successful" : "Invalid OTP or Email");
        if (result) {
          this.closeForgetPasswordModal(); // Call the method to close the modal
        }
      })
      .catch((error) => console.error(error));
  }

  
  closeForgetPasswordModal() {
    const modalElement = document.getElementById('forgotPasswordModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
