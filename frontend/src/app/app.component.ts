import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BackendService } from './backend.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WishList 2.0';
  wishlistForm: FormGroup;
  items!: FormArray;

  constructor(private formBuilder: FormBuilder, private backendService: BackendService) {
    this.wishlistForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.items = this.wishlistForm.get('items') as FormArray;
    this.backendService.getData().subscribe(
      data => {
        this.setItems(data.items);
      }
    )
  }

  setItems(items: any[]) {
    const formArray = this.wishlistForm.get('items') as FormArray;
    items.forEach(item => {
      formArray.push(this.createItem(item));
    });
  }

  createItem(item: any): FormGroup {
    return this.formBuilder.group({
      name: [item.name] || '',
      price: [item.price] || '',
    });
  }

  addItem(): void {
    this.items.push(this.createItem({}));
  }

  submitForm() {
    console.log(this.wishlistForm.value);
    this.backendService.postData(this.wishlistForm.value).subscribe(
      results => {
        console.log("Data sent successfully");
      },
      error => {
        console.log("Error posting data");
      }
    );
  };

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  processImage(event: Event, index: number): void {
  
  }

}
