import { Component, OnInit, Output, EventEmitter} from '@angular/core';
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

  @Output() facultyWasSelected = new EventEmitter<Faculty>();

  semestr$: string = '2013-2014';
  wydzial$: string = 'wgig';
  wydziałForUrl$: string;
  query$: string= '';
  FieldsOfStudy$: Observable<any>;
  urlForSlug$: Observable<any>;
  slugForUrl$: string;
  allSubjects$: Observable<any>;
  listOfUrl: string[] = [];
  slug$: string[]=[];
  slugNumberInUrl: number;


  faculty$: Faculty = new Faculty();


  constructor(private httpService: HttpService) { }
  selectedYear$: string = '2017-2018';


  ngOnInit() {
  //   this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy('2016-2017', 'wgig').pipe(
  //     map(o => o.syllabus),
  //     // tslint:disable-next-line: max-line-length
  //     map(syllabus => syllabus.study_types
  //       .flatMap(studyType => studyType.levels
  //         .flatMap(level => level.study_programmes
  //         .flatMap(subject => {return{
  //           type: studyType.type,
  //           level: level.level,
  //           subject: subject.name,
  //         }})))),

  //   flatMap(a => from(a)),
  //   toArray(),
  // );
  }

  getFieldsOfStudy(c){

    this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(c, this.wydzial$).pipe(
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

  onChange(c){
    console.log(c);
    this.selectedYear$ = c;
  }


  onSelect($event){
    console.log( $event )
  }


  onFacultySelected(faculty: Faculty) {
    this.facultyWasSelected.emit(faculty);
  }

  fields(i){
    console.log(i);

    this.wydzial$= this.faculty$.shortcut$[i];
    this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(this.selectedYear$, this.wydzial$).pipe(
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


    this.urlForSlug$ = this.httpService.getUrlForSlug(this.wydzial$, this.selectedYear$).pipe(map(o => o.syllabus),
    map(syllabus => syllabus.study_types
      .flatMap(studyType => studyType.levels
        .flatMap(level => level.study_programmes
        .flatMap(subject => subject.url))))
      );

  this.urlForSlug$.subscribe((res : string[]) => {
      //console.log(res);
      this.listOfUrl = res;
      console.log(this.listOfUrl[0]);

      for(let i=0; i < this.listOfUrl.length; i++){
        this.slugNumberInUrl = this.listOfUrl[i].lastIndexOf("/");  // podaje numer ostatniego wystąpienia wystąpienia podtekstu

        this.slug$[i] = this.listOfUrl[i].substr(this.slugNumberInUrl + 1 ); // pobiera kawałek tekstu, pramter to poczatek pobieranego kawałka tekstu

        //console.log(this.slug$);
        }
    });

  }

  testowy2(i){


    this.wydziałForUrl$ = this.wydzial$;
    this.slugForUrl$ = this.slug$[i];

  console.log(i);
  console.log(this.slugForUrl$);

//   this.urlForSlug$ = this.httpService.getUrlForSlug(this.wydziałForUrl$, '2017-2018').pipe(map(o => o.syllabus),
//   map(syllabus => syllabus.study_types
//     .flatMap(studyType => studyType.levels
//       .flatMap(level => level.study_programmes
//       .flatMap(subject => subject.url))))
//     );

// this.urlForSlug$.subscribe((res : string[]) => {
//     //console.log(res);
//     this.listOfUrl = res;

//     console.log(this.listOfUrl[i]);

//       this.slugNumberInUrl = this.listOfUrl[i].lastIndexOf("/");  // podaje numer ostatniego wystąpienia wystąpienia podtekstu

//       this.slug$ = this.listOfUrl[i].substr(this.slugNumberInUrl + 1 ); // pobiera kawałek tekstu, pramter to poczatek pobieranego kawałka tekstu

//       //console.log(this.slug$);
//   });

  this.allSubjects$ = this.httpService.getSubjects(this.slugForUrl$, this.selectedYear$).pipe(
      map(o => o.syllabus.assignments
        .map(assignmentWrapper => { return {
          name: assignmentWrapper.assignment.module.name,
          code: assignmentWrapper.assignment.module_code,
          description: assignmentWrapper.assignment.module.description
        }}))
      );
    //map(a => {console.log(a); return a;})
      }
}
