import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from './app.component';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  // pobieramy wszystkie posty, zwracamy observable (- strumień z wartościami który możesz nasłuchiwać - subskrybować)
  // (po to aby potem można było subskrybować metode), liste postów, ciagle w postaci danych jsonowych
  /*getPosts(): Observable<Array<Post>> {
    return this.http.get<Array<Post>>('https://private-anon-9904fbff5c-syllabuskrk.apiary-mock.com/api/current_annual/modules/22520');
  }*/


  getPosts(kierunek: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/2017-2018/magnesite/api/faculties/weaiiib/study_plans/${kierunek}/modules?fields=name,module-code`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'pl',
        'Accept':'application/vnd.syllabus.agh.edu.pl.v2+json'
    }
    )});
  }



  // pobieram wszystkie przedmioty z wydział + przesyłam kierunek // potrzebny slug kierunku 'kierunek'
  getSubjects(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/weaiiib/study_plans/${kierunek}/modules?fields=name`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'pl',
        'Accept':'application/vnd.syllabus.agh.edu.pl.v2+json'
    }
    )});
  }

  // Wszystkie kierunki studiów na danym wydziale na danym semestrze
  getFieldsOfStudy(rok: string, wydzial: string): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/${wydzial}/study_plans`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept-Language': 'pl',
        'Accept':'application/vnd.syllabus.agh.edu.pl.v2+json'
    }
    )});
  }

}
