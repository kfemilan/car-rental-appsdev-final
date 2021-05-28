import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Car } from '../home/home.component';

@Component({
  selector: 'app-rented-cars',
  templateUrl: './rented-cars.component.html',
  styleUrls: ['./rented-cars.component.css']
})
export class RentedCarsComponent implements OnInit {

  @Input() car: Car;

  constructor(private store: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
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
    console.log(difference);
    return difference <= 0 ? total : total + Math.ceil((total*0.8)*difference);
  }

  onSelect(){
    this.router.navigate(['/details', this.car.id]);
  }

}
