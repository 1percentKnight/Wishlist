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
        // console.log("The itemsArray is:", itemsArray);
        results.forEach((item: any) => {
          itemsArray.push(new FormGroup({
            name: new FormControl(item.name, Validators.required),
            price: new FormControl(item.price),
            imageUrl: new FormControl(item.imageUrl || ''),
            file: new FormControl(null),
            editMode: new FormControl(false)
          }));
        });
        // console.log("The itemsArray2 is:", itemsArray);
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
      imageUrl: new FormControl(""),
      file: new FormControl(null),
      editMode: new FormControl(true)
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
    const items = this.wishList.value.items.map((item: any) => {
      if (item.file) {
        formData.append('images', item.file); // Append file to FormData
      }
      return {
        name: item.name,
        price: item.price,
        image: item.file ? item.file.name : item.imageUrl // Reference by filename
      };
    });
    formData.append('items', JSON.stringify(items)); // Append JSON string of items

    this.dbService.postFormData(formData).subscribe(
      (response: any) => {
        console.log("Data stored successfully", response);
      },
      error => {
        console.error("Error submitting data", error);
      }
    );
  }

  onFileChange(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const control = this.items.at(index) as FormGroup;
        control.get('imageUrl')?.setValue(reader.result as string);
        control.get('file')?.setValue(file); // Store file object
      };
      reader.readAsDataURL(file);
    }
  }
}
