import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, DecimalPipe, NgIf } from '@angular/common';
import { ListingsService } from '../../core/services/listings.service';
import { AuthService } from '../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

interface Listing {
  id: number;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  city?: string;
  image?: string;
  status?: string;
  user?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [NgFor, DecimalPipe, NgIf, RouterLink],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css',
})
export class MyListingsComponent implements OnInit {
  listings: Listing[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private listingsService: ListingsService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMyListings();
  }

  loadMyListings() {
    this.isLoading = true;
    this.error = null;
    console.log('Loading user listings...');
    this.listingsService.getMyListings().subscribe({
      next: (data) => {
        console.log('User listings loaded:', data);
        this.listings = data;
        this.cdr.markForCheck();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user listings:', err);
        this.error = `Ошибка загрузки: ${err.error?.detail || err.message || 'Неизвестная ошибка'}`;
        this.isLoading = false;
      }
    });
  }

  deleteListing(id: number) {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      this.listingsService.deleteListings(id).subscribe({
        next: () => {
          console.log('Listing deleted:', id);
          this.listings = this.listings.filter(l => l.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to delete listing:', err);
          alert('Не удалось удалить объявление');
        }
      });
    }
  }

  editListing(id: number) {
    this.router.navigate(['/create'], { queryParams: { id } });
  }

  onListingClick(id: number) {
    this.router.navigate(['/listing', id]);
  }
}
