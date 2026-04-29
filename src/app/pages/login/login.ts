import { LoginService } from './../../services/login';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * Composant de la page de connexion.
 * Gère l'authentification de l'utilisateur via un formulaire réactif.
 * Redirige vers la page des contacts en cas de succès, affiche une erreur sinon.
 */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'], 
})
export class Login implements OnInit {

   /** Groupe de contrôles du formulaire de connexion. */

  loginForm!: FormGroup; 

   /**
   * Injecte les services nécessaires au composant.
   * @param loginService - Service gérant la logique d'authentification.
   * @param router - Service de navigation Angular.
   * @param toastr - Service d'affichage des notifications toast.
   */

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Initialise le formulaire de connexion
   * en utilisant le service LoginService pour construire le FormGroup.
   */

  ngOnInit() {
    this.loginForm = this.loginService.buildForm(); 
  }

  /**
   * Gère la soumission du formulaire de connexion.
   * Vérifie les identifiants via le service LoginService.
   * Si valides, affiche un toast de succès et redirige vers la page des contacts.
   * Sinon, affiche un toast d'erreur.
   */

  onSubmit() { 
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