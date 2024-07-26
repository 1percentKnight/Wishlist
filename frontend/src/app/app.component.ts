import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class AppComponent implements OnInit {
  title = 'Wishlist';
  wishList: FormGroup;

  constructor(private dbService: BackendService) {
    this.wishList = new FormGroup({
      items: new FormArray([])
    });
  }

  ngOnInit() {
    this.dbService.getFormData().subscribe(
      results => {
        const itemsArray = this.wishList.get('items') as FormArray;
        results.forEach((item: any) => {
          itemsArray.push(new FormGroup({
            name: new FormControl(item.name, Validators.required),
            price: new FormControl(item.price),
            editMode: new FormControl(false),
          }));
        });
      },
      error => {
        console.error("Error fetching data", error);
      }
    );
  }

  get items() {
    return this.wishList.get('items') as FormArray;
  }

  addItem() {
    const itemForm = new FormGroup({
      name: new FormControl("", Validators.required),
      price: new FormControl(""),
      editMode: new FormControl(true),
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  toggleEditMode(index: number) {
    const control = this.items.at(index) as FormGroup;
    control.get('editMode')?.setValue(!control.get('editMode')?.value);
  }

  saveItem(index: number) {
    this.toggleEditMode(index);
  }

  submitForm() {
    const formData = new FormData();
    formData.append('items', JSON.stringify(this.wishList.value.items)); // Stringify the items
  
    this.dbService.postFormData(formData).subscribe(
      (response: any) => {
        console.log("Data stored successfully");
      },
      error => {
        console.error("Error submitting data", error);
      }
    );
  }
  
}
