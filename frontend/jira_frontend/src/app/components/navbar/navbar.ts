import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() projectId: number | null = null;
  @Input() projectName: string | null = '';

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
  }
}
