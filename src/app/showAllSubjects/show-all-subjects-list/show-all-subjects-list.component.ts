import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Observable, from } from 'rxjs';
import { Faculty } from 'src/app/faculties/faculties.model';
import { map, flatMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-show-all-subjects-list',
  templateUrl: './show-all-subjects-list.component.html',
  styleUrls: ['./show-all-subjects-list.component.css']
})
export class ShowAllSubjectsListComponent implements OnInit {

  @Output() facultyWasSelected = new EventEmitter<any>();
  constructor(private httpService: HttpService) { }
  allSubjectsLecture$: Observable<any>;
  slug$: string[]=[];
  selectedYear$: string = "2017-2018";
  dataModuleId$: Observable<any>;
  allSubjects$: Observable<any>;

  wydzialDropDown$: Array <string> = ['weaiiib', 'weip', 'wfiis', 'wggiis', 'wggios', 'wgig', 'wh','wieit', 'wimic', 'wimiip', 'wimir','wmn','wms', 'wo', 'wwnig', 'wz'];
  item$: string;

  wydzial$: string = 'wgig';
  FieldsOfStudy$: Observable<any>;
  urlForSlug$: Observable<any>;
  listOfUrl: string[] = [];
  slugNumberInUrl: number;
  year$: string;
  query$: string;
  moduleId$: string= '22520';

  allSubjectsWithQuery$: Observable<any>;

  faculty$: Faculty = new Faculty();
  ngOnInit() {

      for(let i=0; i<this.wydzialDropDown$.length; i++){

        this.item$ =  this.wydzialDropDown$[i];
      this.urlForSlug$ = this.httpService.getUrlForSlug(this.item$, this.selectedYear$).pipe(map(o => o.syllabus),
      map(syllabus => syllabus.study_types
        .flatMap(studyType => studyType.levels
          .flatMap(level => level.study_programmes
          .flatMap(subject => subject.url))))
        );

    this.urlForSlug$.subscribe((res : string[]) => {
        //console.log(res);
        this.listOfUrl = res;
        console.log(this.listOfUrl[0]);

        for(let j=0; j < this.listOfUrl.length; j++){
          this.slugNumberInUrl = this.listOfUrl[j].lastIndexOf("/");  // podaje numer ostatniego wystąpienia wystąpienia podtekstu

          this.slug$.push(this.listOfUrl[j].substr(this.slugNumberInUrl + 1 )); // pobiera kawałek tekstu, pramter to poczatek pobieranego kawałka tekstu
          //this.k++;
          //console.log(this.slug$);
          }
          //this.k--;
      });
  }
}

  onChange(c){
    this.slug$ = [];
    console.log(c);
    this.selectedYear$ = c;
    this.ngOnInit();
  }


  getSubjectsWithName() {
    this.allSubjects$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => { return {
            name: assignmentWrapper.assignment.module.name,
            code: assignmentWrapper.assignment.module_code,
            description: assignmentWrapper.assignment.module.description
          };}))
        )),
      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
  }


}
