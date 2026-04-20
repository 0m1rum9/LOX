import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { ListingsService } from '../../core/services/listings.service';

interface Listing {
  id: number
  title: string
  category: string
  photo: string
  description: string
}

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [NgIf, DecimalPipe],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css'
})
export class ListingDetailComponent implements OnInit {
  listing: Listing | null = null
  isLoading = true

  constructor(private route: ActivatedRoute, private listingsService: ListingsService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.isLoading = true;
    this.listingsService.getListing(id).subscribe({
      next: (data) => {
        this.listing = data;
        this.isLoading = false;
      },
      error: () => {
        this.listing = null;
        this.isLoading = false;
      }
    });
  }
}