import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  title: any;
  description: any;
  constructor(
    public dialogRef: MatDialogRef<TodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onCreate() {
    this.dialogRef.close({ title: this.title, description: this.description });
    console.log(this.title, this.description);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
