import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../common/nav-bar/nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Form fields
  email: string = '';
  password: string = '';
  resetEmail: string = '';
  resetCode: string = '';
  newPassword: string = '';
  currentTime: string = '';

  loginDisabled: boolean = false;
  resetPasswordDisabled: boolean = true;
  constructor(private router: Router) {}
  ngOnInit() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);


  }

// login.component.ts
onLogin() {
  console.log('Login attempted with:', this.email, this.password);
  this.router.navigate(['/home']); // Navigate to the home route under the layout
}

  getResetCode() {
    // Add code sending logic here
    console.log('Reset code requested for:', this.resetEmail);
  }

  resetPassword() {
    // Add password reset logic here
    this.resetEmail = this.email
    console.log('Password reset attempted with:', this.resetEmail, this.resetCode, this.newPassword);
  }
}