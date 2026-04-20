import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { CategoriesService, Category } from '../../core/services/categories.service';
import { ListingsService } from '../../core/services/listings.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.css'
})
export class CreateListingComponent implements OnInit {
  title = ''
  price = ''
  description = ''
  photo = ''

  selectedIds: (number | null)[] = [null]
  levels: Category[][] = []

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private listingsService: ListingsService
  ) {}

  ngOnInit() {
    this.categoriesService.getAll().subscribe((data: Category[]) => {
      this.levels = [data]
      this.selectedIds = [null]
    })
  }

  onCategoryChange(levelIndex: number) {
    const selectedId = Number(this.selectedIds[levelIndex])
    const currentLevel = this.levels[levelIndex]
    const selected = currentLevel.find(c => c.id === selectedId)

    this.levels = this.levels.slice(0, levelIndex + 1)
    this.selectedIds = this.selectedIds.slice(0, levelIndex + 1)

    if (selected && selected.children.length > 0) {
      this.levels.push(selected.children)
      this.selectedIds.push(null)
    }
  }

  getFinalCategoryId(): number | null {
    for (let i = this.selectedIds.length - 1; i >= 0; i--) {
      if (this.selectedIds[i]) return Number(this.selectedIds[i])
    }
    return null
  }

  onSubmit() {
    if (!this.title || !this.price || !this.getFinalCategoryId()) {
      alert('Заполните все обязательные поля')
      return
    }

    const data = {
      title: this.title,
      description: this.description,
      category: this.getFinalCategoryId(),
      price: Number(this.price),
      attributes_values: [],
      photo: this.photo
    }

    this.listingsService.createListing(data).subscribe({
      next: () => {
        alert('Объявление создано!')
        this.router.navigate(['/'])
      },
      error: (err) => {
        alert('Ошибка: ' + JSON.stringify(err.error))
      }
    })
  }
}