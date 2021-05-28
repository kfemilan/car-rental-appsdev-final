import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment';
import { AvailableCarsComponent } from './available-cars/available-cars.component';
import { RentedCarsComponent } from './rented-cars/rented-cars.component';
import { AddCarComponent } from './add-car/add-car.component';
import { ReviewComponent } from './review/review.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AvailableCarsComponent,
    RentedCarsComponent,
    AddCarComponent,
    routingComponents,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
