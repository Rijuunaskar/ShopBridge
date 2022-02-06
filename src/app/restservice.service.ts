import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import {ProductInterface } from './inventory/inventory.component'

@Injectable({
  providedIn: 'root'
})


export class RestserviceService {
  private _url = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getproducts():Observable<ProductInterface[]>{
    let params =  new HttpParams().set('post','fsd');
    let headers = new HttpHeaders().set('Content-Type', 'application/Json');
    return this.http.get<ProductInterface[]>(this._url + '/product',{headers,params});
  }

  deleteproducts(id:number):Observable<ProductInterface[]>{
    return this.http.delete<ProductInterface[]>(this._url + '/product/'+id);
  }

  addproducts(data:ProductInterface):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/Json');
    return this.http.post<ProductInterface[]>(this._url + '/product',data,{headers}).pipe(
      tap( // Log the result or error
        {
          next: (data) => console.log(data),
          error: (error) => this.handleError(error)
        })
    )
  } 


  private handleError(error: HttpErrorResponse) {
    if (error.status === 403 ) {
      console.error('An error occurred:', error.error);
    } else {
      console.error('Somehting went wrong');
    }
    return throwError(
      'Somehting went wrong');
  }
}
