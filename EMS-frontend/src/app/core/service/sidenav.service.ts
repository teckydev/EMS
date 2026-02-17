import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private sidenav!: MatSidenav;

  public register(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public toggle() {
    this.sidenav.toggle();
  }

  public close() {
    this.sidenav.close();
  }
}
