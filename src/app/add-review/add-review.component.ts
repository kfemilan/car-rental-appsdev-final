import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../home/home.component';
import { HttpClient } from '@angular/common/http';
import { Review } from '../car-details/car-details.component';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {

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
    reviewCount: 0,
    reviewTotal: 0
  };
  review: Review = {
    name: "",
    review: "",
    rating: 0,
    chunked: "",
    dateAdded: 0
  }
  score: number;
  chunked: string;

  constructor(private route: ActivatedRoute, private store: AngularFirestore, private router: Router, private httpClient: HttpClient) { }

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
    })
  }

  addReview() {
    let valid = this.validateForm();
    if (valid) {
      var name = document.forms["addForm"]["name"].value;
      var review = (document.getElementById("reviewfield") as HTMLInputElement).value;
      console.log(review);

      this.review.name = name,
      this.review.review = review,
      this.review.dateAdded = new Date()

      this.httpClient.get('http://127.0.0.1:5000/sentiment/'+review).subscribe(data=>{

        this.review.rating = data as number;
        this.store.collection

        this.httpClient.get('http://127.0.0.1:5000/chunk/'+review).subscribe(data=>{

          this.review.chunked = data as string;
          this.store.collection('Cars').doc(this.car.id).collection('Reviews').add(this.review)

          const docRef = this.store.firestore.collection('Cars').doc(this.car.id);
          this.store.firestore.runTransaction(transaction => transaction.get(docRef).then(
            doc => {
              const newReviewCount = doc.data().reviewCount + 1;
              const newReviewTotal = doc.data().reviewTotal + +this.review.rating;
              transaction.update(docRef, {reviewTotal: newReviewTotal, reviewCount: newReviewCount});
            }
          )).then(() => console.log("Transaction successful")).catch(error => console.log("Transaction failed: ", error))

          this.router.navigate(['/details', this.car.id])
        })
      })
    } else {
      alert("Please Complete all fields")
    }
    
  }

  validateForm() {
    var name = document.forms["addForm"]["name"].value;
    var review = document.getElementById("reviewfield") as HTMLInputElement;
    if (name == "" || review.value == ""){
      console.log(review)
      return false;
    }
    return true;
  }

  clear() {
      document.forms["addForm"]["name"].value = "";
      document.getElementById("reviewfield").innerHTML = "";
  }

  skip() {
    this.router.navigate(['/details', this.car.id])
  }

}
