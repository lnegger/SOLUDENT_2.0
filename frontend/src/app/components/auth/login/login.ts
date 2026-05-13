import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Formularios Reactivos
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  // State Management con Signals
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    if (!localStorage.getItem('selectedCompany')) {
      this.router.navigate(['/select-company']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const credentials = this.loginForm.value;

    this.http.post('http://127.0.0.1:8000/api/auth/login', credentials)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.access_token);
          this.isLoading.set(false);
          this.successMessage.set('¡Login exitoso! Redirigiendo al Dashboard...');
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Credenciales inválidas. Por favor, intente de nuevo.');
        }
      });
  }
}
