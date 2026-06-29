import { Injectable, signal } from '@angular/core';

// Api is the single seam to the Go server's /api/* surface. Every read/write is
// proxied server-side through the comms/agent/commerce clients — the browser
// never touches a store directly. A 401 bumps `unauthorized` so the shell can
// bounce back to the login gate.
@Injectable({ providedIn: 'root' })
export class Api {
  readonly unauthorized = signal(0);

  private async req(method: string, path: string, body?: unknown): Promise<any> {
    const opt: RequestInit = { method, headers: {} };
    if (body !== undefined) {
      opt.headers = { 'Content-Type': 'application/json' };
      opt.body = JSON.stringify(body);
    }
    const res = await fetch(path, opt);
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (res.status === 401) {
      this.unauthorized.update((n) => n + 1);
      throw new Error('not authenticated');
    }
    if (!res.ok) throw new Error((data && data.error) || res.statusText);
    return data;
  }

  get(path: string) { return this.req('GET', path); }
  post(path: string, body?: unknown) { return this.req('POST', path, body); }
  put(path: string, body?: unknown) { return this.req('PUT', path, body); }
  del(path: string, body?: unknown) { return this.req('DELETE', path, body); }
}
