import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../home/home.component';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  car: Car = {
    id: "",
    brand: "",
    model: "",
    image: "",
    price: 0,
    color: "",
    rentLength: 0,
    returnDate: 0,
    isRented: false,
    rating: 0,
    reviewTotal: 0,
    reviewCount: 0,
  };
  reviews: any;
  reviewLength: number;
  totalRating: number;


  

  constructor(private store: AngularFirestore, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    const x = this.store.collection('Cars').doc(id).valueChanges({idField: 'id'})
    x.forEach((field) => {
      this.car.id = field.id;
      this.car.model = field['model'];
      this.car.brand = field['brand'];
      this.car.color = field['color'];
      this.car.image = field['image'];
      this.car.price = field['price'];
      this.car.rentLength = field['rentLength'];
      this.car.returnDate = field['returnDate'];
      this.car.isRented = field['isRented'];
      this.car.rating = field['rating'];
      this.car.reviewCount = field['reviewCount'];
      this.car.reviewTotal = field['reviewTotal'];
      this.totalRating = this.car.reviewCount === 0 ? 0 : this.car.reviewTotal/this.car.reviewCount;
    })
    this.reviews = this.store.collection('Cars').doc(id).collection('Reviews', ref => ref.orderBy('dateAdded', "desc")).valueChanges({idField: 'id'});
    this.reviews.subscribe((result:any) => {this.reviewLength = result.length})
    
  }

  rentCar() {
    const duration = prompt("Rent Duration (days)")
    if (duration != null && +duration >= 0){
      this.car.rentLength = +duration;
      this.car.returnDate = new Date();
      this.car.returnDate.setDate(this.car.returnDate.getDate() + +this.car.rentLength);
      this.store.collection('Cars').doc(this.car.id).update({
        "isRented": true, 
        "returnDate" : this.car.returnDate, 
        "rentLength" : this.car.rentLength
      })
    } else if (+duration < 0) {
      alert("Rental days must be 0 or more")
    }

  }

  deleteCar() {
    const conf = confirm("Are you sure you want to delete this vehicle?")
    if (conf){
      this.store.collection('Cars').doc(this.car.id).delete()
      this.router.navigate(['/home'])
    }
  }

  returnCar(){
    const total = this.calculateTotal();
    const payment = prompt("Your Total Is: ₱" + total + ". Please Enter Payment:");
    if (payment != null && +payment >= total) {
      this.car.returnDate = new Date();
      const change = +payment - total;
      alert("Your change is ₱" + change + ". Thank you!");
      this.store.collection('Cars').doc(this.car.id).update({
        "isRented" : false,
        "returnDate" : this.car.returnDate,
        "rentLength" : 0
      })
      this.router.navigate(['/reviews', this.car.id])
    } else if (payment != null && +payment < total){
      const lacking = total - +payment;
      alert("Your payment is insufficient, you lack ₱" + lacking);
    }
  }

  calculateTotal(){
    const today = new Date();
    const ret = this.car.returnDate.toDate();
    const difference = Math.ceil((today.valueOf() - ret.valueOf()) / 86400000);
    const total = this.car.price * this.car.rentLength;
    return difference <= 0 ? total : total + Math.ceil((total*0.8)*difference);
  }


}

export interface Review{
  id?: string;
  name: string;
  review: string;
  rating: number;
  chunked: string;
  dateAdded: any;
}