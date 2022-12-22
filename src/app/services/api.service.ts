import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  catchError,
  ignoreElements,
  Observable,
  ObservableInput,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private token = '';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {
    const fetchedToken = localStorage.getItem('act');

    if (fetchedToken) {
      this.token = atob(fetchedToken);
      this.jwtToken$.next(this.token);
    }
  }

  get jwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  /* getting all data*/
  getAllTodos(): Observable<any> {
    debugger
    return this.http.get(`${this.API_URL}/todo`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  //Create Todo
  createTodo(title: string, description: string) {
    return this.http.post(
      `${this.API_URL}/todo`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  //update Status
  updateStatus(statusValue: string, todoId: number) {
    return this.http
      .patch(
        `${this.API_URL}/todo/${todoId}`,
        { status: statusValue },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .pipe(
        tap((res) => {
          if (res) {
            this.toast.success('status updated successfully', '', {
              timeOut: 1000,
            });
          } else {
            //@ts-ignore
            catchError((err: HttpErrorResponse) => {
              this.toast.error(err.name, '', {
                timeOut: 1000,
              });
            });
          }
        })
      );
  }

  //Delete Todo
  deleteTodo(todoId: number) {
    return this.http
      .delete(`${this.API_URL}/todo/${todoId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((res) => {
          // @ts-ignoreElements
          if (res.success) {
            this.toast.success('Todo deleted success');
          }
        })
      );
  }

  logout() {
    this.token = '';
    this.jwtToken$.next(this.token);
    this.toast
      .success('logged out successfully', '', {
        timeOut: 500,
      })
      .onHidden.subscribe(() => {
        localStorage.removeItem('act');
        this.router.navigateByUrl('/login').then();
      });
    return '';
  }

  login(username: string, password: string) {
    this.http
      .post(`${this.API_URL}/auth/login`, { username, password })

      .subscribe(
        // @ts-ignore
        (res: { token: string }) => {
          this.token = res.token;
          if (this.token) {
            this.toast
              .success('Login Successfully, Redirecting now', '', {
                timeOut: 700,
                positionClass: 'toast-top-center',
              })
              .onHidden.toPromise()
              .then(() => {
                this.jwtToken$.next(this.token);
                localStorage.setItem('act', window.btoa(this.token));
                this.router.navigateByUrl('/').then();
                console.log(res);
              });
          }
        },
        (err: HttpErrorResponse) => {
          this.toast.error('Authrntication failed, Please Try again');
        }
      );
  }

  register(username: String, password: string) {
    return this.http
      .post(`${this.API_URL}/auth/register`, {
        username,
        password,
      })
      .pipe(
        //@ts-ignore
        catchError((err: HttpErrorResponse) => {
          console.log(err)
          this.toast.error(err.error.message, '', {
            timeOut: 1000,
          });
        })
      );
  }
}
