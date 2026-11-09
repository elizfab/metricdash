import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  template: `
    <div class="logout-page">
      <h1>Saindo…</h1>
    </div>
  `,
  styles: `
    .logout-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class Logout implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.auth.sair().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
