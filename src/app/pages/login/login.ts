import { LoginService } from './../../services/login';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'], // ← .css → .scss
})
export class Login implements OnInit {

  loginForm!: FormGroup; // ← profileForm → loginForm

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.loginService.buildForm(); // ← profileForm → loginForm
  }

  onSubmit() { // ← handleSubmit → onSubmit
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const validForm: boolean = this.loginService.checkLogin(email, password);

    if (validForm) {
      this.toastr.success('Connexion réussie', 'Bienvenue 👋');
      this.router.navigate(['/contacts']);
    
    } else {
      
      this.toastr.error('Email ou mot de passe incorrect');
    }
  }
}