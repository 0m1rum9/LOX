import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, DecimalPipe } from '@angular/common';

interface Listing {
  id: number
  title: string
  price: number
  category: string
  city: string
  image: string
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, NgFor, DecimalPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  categories = [
    { name: 'Электроника', image: 'https://img.icons8.com/?size=100&id=ZwGNoFXGbt9n&format=png&color=000000' },
    { name: 'Авто', image: 'https://img.icons8.com/?size=100&id=16553&format=png&color=000000' },
    { name: 'Недвижимость', image: 'https://img.icons8.com/?size=100&id=73&format=png&color=000000' },
    { name: 'Одежда', image: 'https://img.icons8.com/?size=100&id=105819&format=png&color=000000' },
    { name: 'Спорт', image: 'https://img.icons8.com/?size=100&id=59&format=png&color=000000' },
    { name: 'Мебель', image: 'https://img.icons8.com/?size=100&id=y2GWL3nrlTBH&format=png&color=000000' },
  ]

  listings: Listing[] = [
    { id: 1, title: 'iPhone 14 Pro', price: 350000, category: 'Электроника', city: 'Алматы', image: '' },
    { id: 2, title: 'Toyota Camry 2020', price: 12000000, category: 'Авто', city: 'Астана', image: '' },
    { id: 3, title: 'Квартира 2 комн.', price: 25000000, category: 'Недвижимость', city: 'Алматы', image: '' },
    { id: 4, title: 'Nike Air Max', price: 45000, category: 'Одежда', city: 'Шымкент', image: '' },
    { id: 5, title: 'MacBook Pro M2', price: 580000, category: 'Электроника', city: 'Алматы', image: '' },
    { id: 6, title: 'Диван угловой', price: 120000, category: 'Мебель', city: 'Астана', image: '' },
  ]
}