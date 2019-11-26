import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { map, flatMap, toArray } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Faculty } from '../faculties.model';

@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.css']
})
export class FacultyListComponent implements OnInit {

  semestr$: string = '2013-2014';
  wydzial$: string = 'wgig';
  FieldsOfStudy$: Observable<any>;

  faculty$: Faculty = new Faculty();

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy('2016-2017', 'wgig').pipe(
      map(o => o.syllabus),
      // tslint:disable-next-line: max-line-length
      map(syllabus => syllabus.study_types
        .flatMap(studyType => studyType.levels
          .flatMap(level => level.study_programmes
          .flatMap(subject => {return{
            type: studyType.type,
            level: level.level,
            subject: subject.name,
          }})))),

    flatMap(a => from(a)),
    toArray(),
  );
  }

  getFieldsOfStudy(){

    this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(this.semestr$, this.wydzial$).pipe(
      map(o => o.syllabus),
      // tslint:disable-next-line: max-line-length
      map(syllabus => syllabus.study_types
        .flatMap(studyType => studyType.levels
          .flatMap(level => level.study_programmes
          .flatMap(subject => {return{
            type: studyType.type,
            level: level.level,
            subject: subject.name,
          }})))),

    flatMap(a => from(a)),
    toArray(),
  );

  }



}
