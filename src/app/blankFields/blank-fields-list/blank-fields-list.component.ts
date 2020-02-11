import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { HttpService } from '../../http.service';
import { map, flatMap, toArray } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Faculty } from 'src/app/faculties/faculties.model';

@Component({
  selector: 'app-blank-fields-list',
  templateUrl: './blank-fields-list.component.html',
  styleUrls: ['./blank-fields-list.component.css']
})
export class BlankFieldsListComponent implements OnInit {


  @Output() facultyWasSelected = new EventEmitter<any>();

  constructor(private httpService: HttpService) { }
  allSubjectsLecture$: Observable<any>;
  slug$: string[]=[];
  selectedYear$: string = '2017-2018';

  wydzial$: string = 'wgig';
  FieldsOfStudy$: Observable<any>;
  urlForSlug$: Observable<any>;
  listOfUrl: string[] = [];
  slugNumberInUrl: number;
  year$: string;
  check$: boolean = false;

  faculty$: Faculty = new Faculty();


  ngOnInit() {
  }




  getSubjectsWithQueryInLecturev2() {
    this.allSubjectsLecture$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getDataForSearch(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentsWrapper => new SimpleModulev1(assignmentsWrapper.assignment))
        )
      )),

      flatMap(a => from(a)),

      toArray(),
      // map(a => JSON.stringify(a, null, 2))
    );
   // this.getFieldsOfStudy();

    }

  onChange(c){
    console.log(c);
    this.selectedYear$ = c;
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

}

class SimpleActivityv2 {
  type: string;
  description: string;

  constructor(module_activity) {
    this.type = module_activity.type,
    this.description = module_activity.module_classes.map(m => m.module_class.description).join();
  }
}

class SimpleModulev2 {
  name: string;
  description: string;
  literature: string;
  notices: string;
  activities: Array<SimpleActivityv2>;

  constructor(module) {
    this.name = module.name,
    this.description = module.description,
    this.notices = module.notices,
    this.literature = module.literature,
    this.activities = module.module_activities.map(activity => new SimpleActivityv2(activity.module_activity));
  }
}

class SimpleModulev1 {
  module_id: string;
  module_url: string;
  module: SimpleModulev2;

  constructor(assignment) {
    this.module_id = assignment.module_id;
    this.module_url = assignment.module_url;
    this.module = new SimpleModulev2(assignment.module);
  }

}


