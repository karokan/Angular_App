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


  headers =  new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept-Language': 'pl',
    Accept: 'application/vnd.syllabus.agh.edu.pl.v2+json'
  });


  getAllModulesByStudyMode(year: string = '2017-2018', department: string = 'weaiiib', slug: string = 'stacjonarne-informatyka--3'): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${department}/study_plans/${slug}/modules?fields=name,module-code`, {
       headers: this.headers});
  }

  getModuleByStudyMode(moduleId: String, year: string = '2017-2018', department: string = 'weaiiib', slug: string = 'stacjonarne-informatyka--3'): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${year}/magnesite/api/faculties/${department}/study_plans/${slug}/modules/${moduleId}`, {
      headers: this.headers});
  }



getUrlForSlug(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/${kierunek}/study_plans`, {
      headers: this.headers}
    );
  }

  //// testowy get do eksperymentowania ze scieżkami
  getPosts(): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/2017-2018/magnesite/api/faculties/weaiiib/study_plans/stacjonarne-automatyka-i-robotyka--5/modules?fields=name,description,module-activities `, {
      headers: this.headers}
      );
    }



  // pobieram wszystkie przedmioty z wydział + przesyłam kierunek // potrzebny slug kierunku 'kierunek' | modules?field = atrybuty
  getSubjects(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-lengths
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/weaiiib/study_plans/${kierunek}/modules?fields=name,module-code,description,module-activities`, {
      headers: this.headers}
      );
  }

  // Wszystkie kierunki studiów na danym wydziale na danym semestrze
  getFieldsOfStudy(rok: string, wydzial: string): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/${wydzial}/study_plans`, {
      headers: this.headers}
      );
  }

}
