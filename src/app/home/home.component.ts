import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cars = this.store.collection('Cars', ref => ref.where("isRented", "==", false).orderBy("brand").orderBy("model").orderBy("color")).valueChanges({idField: 'id'})
  rented = this.store.collection('Cars', ref => ref.where("isRented", "==", true).orderBy("returnDate")).valueChanges({idField: 'id'});

  constructor(private store: AngularFirestore) { }

  ngOnInit(): void {
  }

}

export interface Car{
  id?: string;
  brand: string;
  model: string;
  color: string;
  image: string;
  price: number;
  rentLength: number;
  returnDate: any;
  isRented: boolean;
  rating: number;
  reviewCount: number;
  reviewTotal: number;
}