import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root', // accessible partout
})
export class LoginService {
  userData!: any;

  constructor(private http: HttpClient) {
    this.getUser().subscribe((data) => {
      this.userData = data;
      console.log('JSON chargé :', this.userData);
    });
  }

  // Récupérer les données utilisateur depuis le json
  private getUser(): Observable<any> {
    return this.http.get('assets/user.json');
  }

  /**
   * @public
   * @name buildForm
   * @memberof LoginService
   * @returns retounr un formGroup
   */
  public buildForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  // Vérifier les identifiants
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
