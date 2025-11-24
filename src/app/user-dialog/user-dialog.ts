import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../models/user/user-model';

@Component({
  selector: 'app-user-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
})
export class UserDialog implements OnInit {
  userForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {user?: User}
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.user;

    this.userForm = this.fb.group({
      firstName: [this.data?.user?.firstName || '', [Validators.required]],
      lastName: [this.data?.user?.lastName || '', [Validators.required]],
      email: [this.data?.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.user?.phone || '', [Validators.required, Validators.pattern('[0-9]{10}')]],
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if(this.userForm.valid) {
      const result: User = {
        id: this.data?.user?.id,
        ...this.userForm.value
      };
      this.dialogRef.close(result)
    }
  }

}
