import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../core/api';
import { UI } from '../core/ui';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ...UI],
  template: `
    <div class="wrap">
      <ui-card padding="lg" class="card">
        <div class="stack">
          <div>
            <ui-text variant="h3">{{ needsSetup() ? 'Set a password' : 'zcoms console' }}</ui-text>
            <ui-text variant="caption" class="muted">
              {{ needsSetup() ? 'First run — choose the owner password for this console.' : 'Log in to continue.' }}
            </ui-text>
          </div>
          <ui-password-input [(ngModel)]="pw" placeholder="password" (keydown.enter)="submit()"></ui-password-input>
          @if (error()) {
            <ui-text variant="caption" style="color: var(--ui-color-danger)">{{ error() }}</ui-text>
          }
          <ui-button variant="primary" [block]="true" [loading]="busy()" (click)="submit()">Continue</ui-button>
        </div>
      </ui-card>
    </div>
  `,
  styles: [`
    .wrap { display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: var(--ui-space-6); }
    .card { width: 380px; max-width: 100%; }
  `],
})
export class LoginComponent {
  private api = inject(Api);
  done = output<void>();

  pw = '';
  busy = signal(false);
  error = signal('');
  needsSetup = signal(false);

  constructor() {
    this.api.get('/api/auth/status').then((s) => this.needsSetup.set(!!s.needs_setup)).catch(() => {});
  }

  async submit() {
    if (!this.pw) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.post('/api/login', { password: this.pw });
      this.done.emit();
    } catch (e: any) {
      this.error.set(e?.message || 'login failed');
    } finally {
      this.busy.set(false);
    }
  }
}
