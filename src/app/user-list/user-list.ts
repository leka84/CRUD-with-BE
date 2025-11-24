import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../models/user/user-model';
import { UserService } from '../user-serivice/user-service';
import { UserDialog } from '../user-dialog/user-dialog';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAnchor,
    MatIconButton
],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {

  dataSource = new MatTableDataSource<User>([]);
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
    },
    error: () => this.snackBar.open('Failed to load users', 'OK', {duration: 3000})
    });
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      
      if(result.id) {
        this.userService.updateUser(result).subscribe(
          {
            next: () => {
              this.snackBar.open('User updated', 'Ok', {duration: 3000});
              this.loadUsers();
            },
            error: () => this.snackBar.open('Failed to update user', 'OK', {duration: 3000})
          }
        )
      } else {
        this.userService.addUser(result).subscribe(
          {
            next: () => {
              this.snackBar.open('User Added', 'Ok', {duration: 3000});
              this.loadUsers();
            },
            error: () => this.snackBar.open('Failed to add user', 'Ok', {duration: 3000})
          }
        )
      }
    })
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {message: `Delete ${user.firstName} ${user.lastName} ?`}
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if(confirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted', 'Ok', {duration: 3000});
            this.loadUsers();
          },
          error: () => this.snackBar.open('Delete failed', 'OK', {duration: 3000})
        })
      }
    })
  }
}
