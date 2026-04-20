import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, DecimalPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

interface Category {
  id: number
  name: string
  parentId: number | null
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
  selectedCategoryId: number | null = null
  allListings: Listing[] = []
  categories: Category[] = []
  isLoading = true
  error = ''

  constructor(
    private route: ActivatedRoute,
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
        this.categories = this.flattenCategories(data)
        this.route.queryParams.subscribe(params => {
  if (params['category']) {
    const found = this.categories.find(c => c.name === params['category'])
    if (found) {
      this.selectedCategoryIds = this.getAllChildIds(found.id, this.categories)
    }
  }
  this.cdr.detectChanges()
        })
      }
    })
  }

  private flattenCategories(categories: any[], result: Category[] = []): Category[] {
    for (const cat of categories) {
      result.push({ id: cat.id, name: cat.name, parentId: cat.parentId })
      if (cat.children && cat.children.length > 0) {
        this.flattenCategories(cat.children, result)
      }
    }
    return result
  }
selectedCategoryIds: number[] = []
  loadListings() {
    this.isLoading = true
    this.error = ''
    this.listingsService.getListings().subscribe({
      next: (data) => {
        this.allListings = data
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

  get filteredListings() {
  return this.allListings.filter(item => {
    const matchesQuery = !this.query ||
      item.title.toLowerCase().includes(this.query.toLowerCase())
    const matchesCategory = this.selectedCategoryIds.length === 0 ||
      this.selectedCategoryIds.includes(item.category)
    return matchesQuery && matchesCategory
  })
  }
  private getAllChildIds(categoryId: number, allCategories: Category[]): number[] {
  const ids: number[] = [categoryId]
  const children = allCategories.filter(c => c.parentId === categoryId)
  for (const child of children) {
    ids.push(...this.getAllChildIds(child.id, allCategories))
  }
  return ids
}

  onSearch() {
    this.cdr.detectChanges()
  }

 onCategorySelect(cat: Category) {
  if (this.selectedCategoryIds.includes(cat.id)) {
    this.selectedCategoryIds = []
  } else {
    this.selectedCategoryIds = this.getAllChildIds(cat.id, this.categories)
  }
  this.cdr.detectChanges()
}

  onListingClick(id: number) {
    this.router.navigate(['/listing', id])
  }
}