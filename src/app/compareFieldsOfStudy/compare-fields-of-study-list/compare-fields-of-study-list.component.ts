import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Faculty } from 'src/app/faculties/faculties.model';
import { Observable, from } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { map, flatMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-compare-fields-of-study-list',
  templateUrl: './compare-fields-of-study-list.component.html',
  styleUrls: ['./compare-fields-of-study-list.component.css']
})
export class CompareFieldsOfStudyListComponent implements OnInit {

  @Output() facultyWasSelected = new EventEmitter<any>();
  selectedYear$: string = '2017-2018';

  semestr$: string = '2013-2014';
  wydzial$: string = 'wgig';
  wydziałForUrl$: string;
  query$: string= '';
  FieldsOfStudy$: Observable<any>;
  FieldsOfStudy2$: Observable<any>;
  urlForSlug$: Observable<any>;
  slugForUrl$: string;
  allSubjects$: Observable<any>;
  allSubjects2$: Observable<any>;
  listOfUrl: string[] = [];
  slug$: string[]=[];
  slugNumberInUrl: number;

  constructor(private httpService: HttpService) { }

  faculty$: Faculty = new Faculty();
  faculty3$: Faculty = new Faculty();

  ngOnInit() {
  }



  onChange(c){
    console.log(c);
    this.selectedYear$ = c;

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

fields2(i){
  console.log(i);

  this.wydzial$= this.faculty$.shortcut$[i];
  this.FieldsOfStudy2$ = this.httpService.getFieldsOfStudy(this.selectedYear$, this.wydzial$).pipe(
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


this.allSubjects$ = this.httpService.getSubjects(this.slugForUrl$, '2017-2018').pipe(
    map(o => o.syllabus.assignments
      .map(assignmentWrapper => { return {
        notices: assignmentWrapper.assignment.module.notices,
        literature: assignmentWrapper.assignment.module.literature,
        prerequisites: assignmentWrapper.assignment.module.prerequisites,
        creditConditions: assignmentWrapper.assignment.module.credit_conditions,
        ectsPoints: assignmentWrapper.assignment.module.ects_points,
        name: assignmentWrapper.assignment.module.name,
        code: assignmentWrapper.assignment.module_code,
        description: assignmentWrapper.assignment.module.description
      }}))
    );
  //map(a => {console.log(a); return a;})
    }


    testowy3(i){


      this.wydziałForUrl$ = this.wydzial$;
      this.slugForUrl$ = this.slug$[i];

    console.log(i);
    console.log(this.slugForUrl$);

    this.allSubjects2$ = this.httpService.getSubjects(this.slugForUrl$, '2017-2018').pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => { return {
            notices: assignmentWrapper.assignment.module.notices,
            literature: assignmentWrapper.assignment.module.literature,
            prerequisites: assignmentWrapper.assignment.module.prerequisites,
            creditConditions: assignmentWrapper.assignment.module.credit_conditions,
            ectsPoints: assignmentWrapper.assignment.module.ects_points,
            name: assignmentWrapper.assignment.module.name,
            code: assignmentWrapper.assignment.module_code,
            description: assignmentWrapper.assignment.module.description
          }}))
        );
      //map(a => {console.log(a); return a;})
        }
}

