import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Car } from '../home/home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-cars',
  templateUrl: './available-cars.component.html',
  styleUrls: ['./available-cars.component.css']
})
export class AvailableCarsComponent implements OnInit {

  @Input() car: Car;

  constructor(private store: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
  }

  rentCar() {
    const duration = prompt("Rent Duration (days)")
    if (duration != null && +duration >= 0){
      this.car.rentLength = +duration;
      this.car.returnDate = new Date()
      this.car.returnDate.setDate(this.car.returnDate.getDate() + +this.car.rentLength)
      this.store.collection('Cars').doc(this.car.id).update({
        "isRented": true, 
        "returnDate" : this.car.returnDate, 
        "rentLength" : this.car.rentLength
      })
    } else if (+duration < 0) {
      alert("Rental days must be 0 or more")
    }

  }

  onSelect(){
    this.router.navigate(['/details', this.car.id]);
  }

}
