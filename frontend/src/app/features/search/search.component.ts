import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, DecimalPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingsService } from '../../core/services/listings.service';
import { CategoriesService } from '../../core/services/categories.service';
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
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgFor, DecimalPipe, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
 query = ''
 selectedCategory = ''
 allListings: Listing[] = []
 categories: string[] = []
 isLoading = true
 categoriesLoading = true

 constructor(
   private route: ActivatedRoute,
   private router: Router,
   private listingsService: ListingsService,
   private categoriesService: CategoriesService,
   private cdr: ChangeDetectorRef
 ) {
   this.route.queryParams.subscribe(params => {
     this.selectedCategory = params['category'] ?? '';
   });
 }

 ngOnInit() {
   console.log('SearchComponent ngOnInit');
   this.loadCategories();
   this.loadListings();
 }

 loadCategories() {
   this.categoriesService.getAll().subscribe({
     next: (data) => {
       // Flatten hierarchical categories to string array
       this.categories = this.flattenCategories(data);
       this.cdr.markForCheck();
       this.categoriesLoading = false;
     },
     error: () => {
       console.error('Failed to load categories');
       this.categoriesLoading = false;
     }
   });
 }

 private flattenCategories(categories: any[], result: string[] = []): string[] {
   for (const cat of categories) {
     result.push(cat.name);
     if (cat.children && cat.children.length > 0) {
       this.flattenCategories(cat.children, result);
     }
   }
   return result;
 }

 loadListings() {
   this.isLoading = true;
   console.log('Loading listings...');
   this.listingsService.getListings().subscribe({
     next: (data) => {
       console.log('Listings loaded:', data);
       console.log('Before assign, allListings:', this.allListings.length);
       this.allListings = data;
       console.log('After assign, allListings:', this.allListings.length);
       this.cdr.markForCheck();
       this.isLoading = false;
     },
     error: (err) => {
       console.error('Failed to load listings:', err);
       this.isLoading = false;
     }
   });
 }

 onListingClick(id: number) {
  this.router.navigate(['/listing', id])
}

 get filteredListings() {
   const result = this.allListings.filter(item => {
     const matchesQuery = !this.query || item.title.toLowerCase().includes(this.query.toLowerCase());
     const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
     return matchesQuery && matchesCategory;
   })
   console.log('Filtered listings:', {
     query: this.query,
     selectedCategory: this.selectedCategory,
     allCount: this.allListings.length,
     filteredCount: result.length
   });
   return result;
 }

 onSearch() {

 }

 onCategorySelect(category: string) {
    this.selectedCategory = this.selectedCategory === category ? '' : category
 }
}
