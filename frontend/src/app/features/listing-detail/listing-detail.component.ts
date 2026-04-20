import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, JsonPipe } from '@angular/common';
import { ListingsService } from '../../core/services/listings.service';

interface Listing {
  id: number
  title: string
  category: number
  photo: string | null
  description: string
  status: string
  user: number
}

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgIf, JsonPipe],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css'
})
export class ListingDetailComponent implements OnInit {
  listing: Listing | null = null
  isLoading = true

  constructor(
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit called')
    const id = Number(this.route.snapshot.paramMap.get('id'))
    console.log('Loading listing id:', id)
    this.isLoading = true

    this.listingsService.getListing(id).subscribe({
      next: (data: any) => {
        console.log('Listing data:', data)
        this.listing = data
        this.isLoading = false
        this.cdr.markForCheck()
        this.cdr.detectChanges()
      },
      error: (err: any) => {
        console.error('Listing error:', err)
        this.listing = null
        this.isLoading = false
        this.cdr.markForCheck()
        this.cdr.detectChanges()
      }
    })
  }
}