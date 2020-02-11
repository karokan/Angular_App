import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { HttpService } from '../../http.service';
import { map, flatMap, toArray, filter } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Faculty } from 'src/app/faculties/faculties.model';

@Component({
  selector: 'app-search-subject-list',
  templateUrl: './search-subject-list.component.html',
  styleUrls: ['./search-subject-list.component.css']
})
export class SearchSubjectListComponent implements OnInit {

  @Output() facultyWasSelected = new EventEmitter<any>();

  constructor(private httpService: HttpService) { }
  allSubjectsLecture$: Observable<any>;
  slug$: string[]=[];
  selectedYear$: string = '2017-2018';
  dataModuleId$: Observable<any>;

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
  }

  onChange(c){
    console.log(c);
    this.selectedYear$ = c;

  }


  moduleIdFunction(){
      this.dataModuleId$ = this.httpService.getDataFromModuleId('22520').pipe(
        map(o => JSON.stringify(o, null, 2))
    );
  }


  onChangeShortCut(i){

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

  getSubjectsWithQuery() {
    this.allSubjectsWithQuery$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => assignmentWrapper.assignment.module.name))
        )),
      flatMap(a => from(a)),
      filter((subject: string) => subject.indexOf(this.query$) >= 0),
      toArray(),
      map(a => {console.log(a); return a; })
    );
    }


  getSubjectsWithQueryInLecturev3() {
      this.allSubjectsLecture$ = from(this.slug$).pipe(
        flatMap(slug => this.httpService.getDataForSearch(slug, this.selectedYear$).pipe(
          map(o => o.syllabus.assignments
            .map(assignmentWrapper => new SimpleModulev4(assignmentWrapper.assignment))
            .filter(simpleActivityv3 => simpleActivityv3.matches(this.query$))
          )
        )),

        flatMap(a => from(a)),

        toArray(),
        // map(a => JSON.stringify(a, null, 2))
      );
     // this.getFieldsOfStudy();

      }

      subjectId(x){
        console.log(x);
      }

}




///////////////// Do szukania przedmiotu - wypisuje nazwe, pobieram module_id które wysyłam dalej/////


abstract class Matchablev3 {
  abstract matches(query: string): boolean;

  protected valueMatches(value: string, query: string): boolean {
    if (query == null || query == "") return true;
    return value != null && value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1;
  }
}

class SimpleModulev3 extends Matchablev3 {
  name: string;
  literature: string;
  notices: string;
  description: string;

  constructor(module) {
    super();
    this.name = module.name,
    this.notices = module.notices,
    this.literature = module.literature,
    this.description = module.description
  }

  matches(query: string): boolean {
    return this.valueMatches(this.name, query) ||
      this.valueMatches(this.description, query)
  }

}

class SimpleModulev4 extends Matchablev3{
  module_id: string;
  module_url: string;
  module: SimpleModulev3;

  constructor(assignment) {
    super();
    this.module_id = assignment.module_id;
    this.module_url = assignment.module_url;
    this.module = new SimpleModulev3(assignment.module);
  }

  matches(query: string): boolean {
    return this.valueMatches(this.module.name, query) || this.module.matches(query);
  }


}
