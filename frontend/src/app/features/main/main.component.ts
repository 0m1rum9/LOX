import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, DecimalPipe, NgIf } from '@angular/common';
import { ListingsService } from '../../core/services/listings.service';
import { CategoriesService } from '../../core/services/categories.service';

interface Listing {
  id: number
  title: string
  description: string
  price: number
  category: number
  photo: string | null
  status: string
  user: number
}

interface CategoryWithImage {
  id: number
  name: string
  image: string
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NgFor, DecimalPipe, NgIf],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  listings: Listing[] = []
  categories: CategoryWithImage[] = []
  isLoading = true
  error = ''

  private categoryIcons: { [key: string]: string } = {
    'Электроника': 'https://img.icons8.com/?size=100&id=ZwGNoFXGbt9n&format=png&color=000000',
    'Авто': 'https://img.icons8.com/?size=100&id=16553&format=png&color=000000',
    'Недвижимость': 'https://img.icons8.com/?size=100&id=73&format=png&color=000000',
    'Одежда': 'https://img.icons8.com/?size=100&id=105819&format=png&color=000000',
    'Спорт': 'https://img.icons8.com/?size=100&id=59&format=png&color=000000',
    'Дом и сад': 'https://img.icons8.com/?size=100&id=67307&format=png&color=000000',
    'Детские товары': 'https://img.icons8.com/?size=100&id=34590&format=png&color=000000',
    'Услуги': 'https://img.icons8.com/?size=100&id=XwzkraQQ32YR&format=png&color=000000'
  }

  constructor(
    private router: Router,
    private listingsService: ListingsService,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories()
    this.loadListings()
  }

  loadCategories() {
    this.categoriesService.getAll().subscribe({
      next: (data) => {
        this.categories = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: this.categoryIcons[cat.name] || this.categoryIcons['Электроника']
        }))
        this.cdr.detectChanges()
      },
      error: () => {
        console.error('Не удалось загрузить категории')
      }
    })
  }

  loadListings() {
    this.isLoading = true
    this.error = ''
    this.listingsService.getListings().subscribe({
      next: (data) => {
        this.listings = data
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: () => {
        this.error = 'Не удалось загрузить объявления'
        this.isLoading = false
        this.cdr.detectChanges()
      }
    })
  }

  onCategoryClick(categoryName: string) {
    this.router.navigate(['/search'], { queryParams: { category: categoryName } })
  }

  onListingClick(id: number) {
    this.router.navigate(['/listing', id])
  }
}