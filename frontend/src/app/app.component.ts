import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule, FormBuilder, AbstractControl } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BackendService } from './backend.service';
import { IndianCurrencyPipe } from './indian-currency.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, RouterOutlet, CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, IndianCurrencyPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'WishList 2.0';
  wishlistForm: FormGroup;
  items!: FormArray;
  totalPrice: number = 0;

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
        this.totalPrice = data.totalPrice;
      }
    );
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
      quantity: [item.quantity || 1],
    });
  }

  addItem(): void {
    this.items.push(this.createItem({}));
  }

  submitForm() {
    this.backendService.postData(this.wishlistForm.value).subscribe(
      error => {
        console.log("Error posting data");
        console.error(error);
        return;
      }
    );
    alert("Data updated successfully");
  }

  increaseQuantity(index: number): void {
    const currentQuantity = this.items.at(index).get('quantity')?.value || 0;
    this.items.at(index).get('quantity')?.setValue(currentQuantity + 1);
  }

  decreaseQuantity(index: number): void {
    const currentQuantity = this.items.at(index).get('quantity')?.value || 0;
    if (currentQuantity > 1) {
      this.items.at(index).get('quantity')?.setValue(currentQuantity - 1);
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTotalPrice(item: AbstractControl): number {
    const price = item.get('price')?.value || 0;
    const quantity = item.get('quantity')?.value || 1;
    return price * quantity;
  }

  calculateGrandTotal(): number {
    let grandTotal = 0;
    this.items.controls.forEach(item => {
      grandTotal += this.calculateTotalPrice(item);
    });
    return grandTotal;
  }

  moveRowUp(index: number): void {
    if (index > 0) {
      const item = this.items.at(index);
      this.items.removeAt(index);
      this.items.insert(index - 1, item);
    }
  }

  moveRowDown(index: number): void {
    if (index < this.items.length - 1) {
      const item = this.items.at(index);
      this.items.removeAt(index);
      this.items.insert(index + 1, item);
    }
  }
}