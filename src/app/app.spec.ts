/**
 * @file app.spec.ts
 * @description Tests unitaires pour le composant racine de l'application.
 * Ces tests vérifient le bon fonctionnement et le rendu initial du composant App.
 */

import { TestBed } from '@angular/core/testing';
import { App } from './container/app';

describe('App', () => {
  /**
   * Configuration du module de test avant chaque exécution de test.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  /**
   * Teste si l'instance de l'application est créée avec succès.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Teste si le titre est correctement affiché dans le rendu HTML.
   */
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ApiGestionFootAngular');
  });
});
