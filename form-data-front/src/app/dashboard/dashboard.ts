import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';
import { NgIf } from '@angular/common';
import { Router ,RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf , RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService , private router: Router) {}

  ngOnInit(): void {
    this.authService.dashboard().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        this.user = data?.user || data; // Handles both possibilities
      },
      error: (err) => {
        console.error('Dashboard fetch error:', err);
      }
    });
  }

  logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
