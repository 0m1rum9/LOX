import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Listing {
  id: number;
  title: string;
  price: number;
  category: string;
  city: string;
  image: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgFor, DecimalPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
 query = ''
 selectedCategory = ''

 constructor(private route: ActivatedRoute) {
   this.route.queryParams.subscribe(params => {
     this.selectedCategory = params['category'] ?? '';
   });
 }

 categories = ['Электроника', 'Авто', 'Недвижимость', 'Одежда', 'Спорт', 'Дом и сад', 'Детские товары', 'Услуги']

 allListings: Listing[] = [
   { id: 1, title: 'iPhone 17 Pro', price: 999, category: 'Электроника', city: 'Москва', image: 'https://via.placeholder.com/150' },
   { id: 2, title: 'BMW X5', price: 50000, category: 'Авто', city: 'Санкт-Петербург', image: 'https://via.placeholder.com/150' },
   { id: 3, title: 'Квартира на Абая', price: 200000, category: 'Недвижимость', city: 'Москва', image: 'https://via.placeholder.com/150' },
   { id: 4, title: 'Куртка зимняя', price: 150, category: 'Одежда', city: 'Новосибирск', image: 'https://via.placeholder.com/150' },
   { id: 5, title: 'Гантели 20 кг', price: 80, category: 'Спорт', city: 'Екатеринбург', image: 'https://via.placeholder.com/150' },
   { id: 6, title: 'Садовая мебель', price: 300, category: 'Дом и сад', city: 'Казань', image: 'https://via.placeholder.com/150' },
   { id: 7, title: 'Игрушки для детей', price: 50, category: 'Детские товары', city: 'Нижний Новгород', image: 'https://via.placeholder.com/150' },
   { id: 8, title: 'Ремонт компьютеров', price: 100, category: 'Услуги', city: 'Москва', image: 'https://via.placeholder.com/150' },
 ]

 get filteredListings() {
   return this.allListings.filter(item => {
     const matchesQuery = item.title.toLowerCase().includes(this.query.toLowerCase());
     const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
     return matchesQuery && matchesCategory;
   })
 }

 onSearch() {

 }

 onCategorySelect(category: string) {
    this.selectedCategory = this.selectedCategory === category ? '' : category
 }
}
