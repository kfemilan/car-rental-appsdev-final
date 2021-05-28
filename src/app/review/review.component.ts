import { Component, OnInit, Input } from '@angular/core';
import { Review } from '../car-details/car-details.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @Input() review: Review;
  chunk: boolean = false;
  chunkDisplay: string = "Chunk";
  constructor() { }

  ngOnInit(): void {
  }

  displayChunk(){
    this.chunk = !this.chunk;
    if(this.chunk == false) {
      this.chunkDisplay = "Chunk"
    } else {
      this.chunkDisplay = "Original"
    }
    console.log(this.chunk)
  }

}
