import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Service gérant l'authentification de l'utilisateur.
 * Charge les données utilisateur depuis un fichier JSON local
 * et expose les méthodes de construction du formulaire et de vérification des identifiants.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /** Données utilisateur chargées depuis le fichier JSON. */
  userData!: any;
  /**
   * Injecte le service HttpClient et charge les données utilisateur au démarrage.
   * @param http - Service HTTP Angular pour effectuer les requêtes.
   */
  constructor(private http: HttpClient) {
    this.getUser().subscribe((data) => {
      this.userData = data;
      console.log('JSON chargé :', this.userData);
    });
  }
  /**
   * Récupère les données utilisateur depuis le fichier JSON local.
   * @returns Un Observable contenant les données utilisateur.
   */
  private getUser(): Observable<any> {
    return this.http.get('assets/user.json');
  }

  /**
   * @public
   * @name buildForm
   * @memberof LoginService
   * @returns retounr un formGroup
   */

  /**
   * Construit et retourne le formulaire réactif de connexion
   * avec les validations requises sur l'email et le mot de passe.
   * @returns Un FormGroup contenant les champs email et password.
   */
  public buildForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  /**
   * Vérifie si les identifiants fournis correspondent à un utilisateur existant.
   * Recherche dans le tableau d'utilisateurs chargé depuis le JSON.
   * @param email - L'adresse email saisie par l'utilisateur.
   * @param password - Le mot de passe saisi par l'utilisateur.
   * @returns `true` si les identifiants sont valides, `false` sinon.
   */
  public checkLogin(email: string, password: string): boolean {
    if (!this.userData || !this.userData.user) {
      console.error('userData non chargé');
      return false;
    }

    // On cherche dans le tableau
    const found = this.userData.user.find((u: any) => u.email === email && u.password === password);

    return !!found;
  }
}
