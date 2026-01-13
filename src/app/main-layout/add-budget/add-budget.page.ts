import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.page.html',
  styleUrls: ['./add-budget.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class AddBudgetPage implements OnInit {
  form = this.fb.group({
    month: ['', Validators.required],
    limit: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private firestore: Firestore) {}

  saveBudget() {
    setDoc(doc(this.firestore, 'budgets', 'current'), this.form.value);
  }

  ngOnInit() {}
}
