import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    
  ],
  template: `

    <router-outlet> </router-outlet>
  `,
  styleUrls: ['./app.css']
})
export class App {
  title = 'your-angular-app';
}
