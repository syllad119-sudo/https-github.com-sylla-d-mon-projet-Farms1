import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Service gérant l'authentification de l'utilisateur.
 * Communique avec l'API backend pour vérifier les identifiants.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /** URL de base de l'API d'authentification. */
  private apiUrl = 'http://localhost:5143/api/auth/login';

  /**
   * Injecte le service HttpClient pour effectuer les requêtes HTTP.
   * @param http - Service HTTP Angular.
   */
  constructor(private http: HttpClient) {}

  /**
   * Construit et retourne le formulaire réactif de connexion
   * avec les validations requises sur le nom d'utilisateur et le mot de passe.
   * @returns Un FormGroup contenant les champs username et password.
   */
  public buildForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  /**
   * Envoie les identifiants au backend pour vérification.
   * @param username - Le nom d'utilisateur saisi.
   * @param password - Le mot de passe saisi.
   * @returns Un Observable contenant la réponse du backend.
   */
  public login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }
}