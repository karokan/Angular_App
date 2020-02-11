import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }


  headers =  new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept-Language': 'pl',
    Accept: 'application/vnd.syllabus.agh.edu.pl.v2+json'
  });

  headerForIdModule = new HttpHeaders({
    'Accept-Language': 'pl'
  });


  getAllModulesByStudyMode(year: string = '2017-2018', department:
                           string = 'weaiiib',
                           slug: string = 'stacjonarne-informatyka--3')
                           : Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${year}
    /magnesite/api/faculties/${department}/study_plans/${slug}
    /modules?fields=name,module-code`, {
       headers: this.headers});
  }

  getModuleByStudyMode(moduleId: string, year: string = '2017-2018', department: string = 'weaiiib',
                       slug: string = 'stacjonarne-informatyka--3'): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${year}
    /magnesite/api/faculties/${department}/study_plans/${slug}/modules/${moduleId}`, {
      headers: this.headers});
  }



getUrlForSlug(wydzial: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/${wydzial}/study_plans`, {
      headers: this.headers}
    );
  }


  getPosts(): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/2017-2018/magnesite/api/faculties/eip/study_plans/stacjonarne-energetyka/modules?`, {
      headers: this.headers}
      );
    }


  getPostsv2(): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://syllabuskrk.agh.edu.pl/2017-2018/magnesite/api/faculties/eip/study_plans/stacjonarne-kulturoznawstwo/modules?`, {
      headers: this.headers}
      );
    }



  // pobieram wszystkie przedmioty z wydział + przesyłam kierunek // potrzebny slug kierunku 'kierunek' | modules?field = atrybuty
  getSubjects(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-lengths
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/weaiiib/study_plans/${kierunek}/modules?fields=name,module-code,ects-points,credit-conditions,prerequisites,literature,notices,module-url,description,module-activities`, {
      headers: this.headers}
      );
  }

  // Wszystkie kierunki studiów na danym wydziale na danym semestrze
  getFieldsOfStudy(rok: string, wydzial: string): Observable<any> {
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/${wydzial}/study_plans`, {
      headers: this.headers}
      );
  }



  // pobieram wszystkie przedmioty z wydział + przesyłam kierunek // potrzebny slug kierunku 'kierunek' | modules?field = atrybuty
  getDataForSearch(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-lengths
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/weaiiib/study_plans/${kierunek}/modules?fields=name,description,notices,literature,activities,module_id,module_url,module_activities`, {
      headers: this.headers}
      );
  }

  getDataWithSemestr(kierunek: string, rok: string): Observable<any> {
    // tslint:disable-next-line: max-line-lengths
    return this.http.get(`https://syllabuskrk.agh.edu.pl/${rok}/magnesite/api/faculties/weaiiib/study_plans/${kierunek}`, {
      headers: this.headers}
      );
  }

  getDataFromModuleId(moduleId: string): Observable<any> {
    // tslint:disable-next-line: max-line-lengths
    return this.http.get(`https://syllabuskrk.agh.edu.pl/api/current_annual/modules/${moduleId}/`, {
      headers: this.headers}
      );
  }

}
