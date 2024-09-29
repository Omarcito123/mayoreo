import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { user } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<user>;
    public currentUser: Observable<user>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<user>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): user {
        return this.currentUserSubject.value;
    }

    public get isLoggedIn(): boolean {
        if(this.currentUserSubject.value != null){
            return true;
        }else{
            return false;
        }
    }

    setJwt(userSesion: user): void {
        localStorage.setItem('currentUser', JSON.stringify(userSesion));
        //localStorage.setItem('token', userSesion.token.toString().replace('Bearer ', '').replace(' ', ''));
        this.currentUserSubject.next(userSesion);
    }

    getJwt(): string {
        return localStorage.getItem('token') || '{}';
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(new user());
        this.router.navigate(['/login']);
    }
}