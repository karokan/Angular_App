import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Faculty } from 'src/app/faculties/faculties.model';
import { HttpService } from 'src/app/http.service';
import { Observable, from } from 'rxjs';
import { map, flatMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-show-subjects-list',
  templateUrl: './show-subjects-list.component.html',
  styleUrls: ['./show-subjects-list.component.css']
})
export class ShowSubjectsListComponent implements OnInit {


  @Output() facultyWasSelected = new EventEmitter<any>();
  constructor(private httpService: HttpService) { }
  allSubjectsLecture$: Observable<any>;
  slug$: string[]=[];
  selectedYear$: string = '2017-2018';
  dataModuleId$: Observable<any>;
  allSubjects$: Observable<any>;

  wydzial$: string = 'wgig';
  FieldsOfStudy$: Observable<any>;
  urlForSlug$: Observable<any>;
  listOfUrl: string[] = [];
  slugNumberInUrl: number;
  year$: string;
  query$: string;
  moduleId$: string= '22520';
  warunek$: boolean = false;
  warunek2$: boolean = false;
  numerSemestru$: number;
  czas$: number;

  allSubjectsWithQuery$: Observable<any>;

  faculty$: Faculty = new Faculty();
  ngOnInit() {
  }

  onChange(c){
    console.log(c);
    this.selectedYear$ = c;
  }

  onChangeShortCutSemestr(i){
    this.warunek$= true;
    this.numerSemestru$ = i+1;
  }

  onChangeShortCutSemestr2(i){
    this.warunek2$= true;
    this.numerSemestru$ = i+1;
    this.czas$= i+1;
    this.warunek$ = false;
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

  func(sem) {
    const moduleCodes = sem.groups.flatMap(g => {
      if (!g.modules) {
        return g.groups.flatMap(innerG => innerG.modules.flatMap(m => m.module_code));
      } else {
        return g.modules.flatMap(m => m.module_code);
      }
    });

    const result =  {
      number: sem.number,
      codes: moduleCodes
    };

    // console.log(result);

    return result;
  }

  getSubjectsWithName() {

    this.allSubjects$ = from(this.slug$).pipe(
      flatMap(slug => {
        var semesters = this.httpService.getDataWithSemestr(slug, this.selectedYear$).pipe(
          map(o => o.syllabus.study_plan.semesters.map(sem => this.func(sem))),
          map(semesters => {
            const result = {};
            semesters.forEach(semester => {
              semester.codes.forEach(moduleCode => {
                result[moduleCode] = semester.number;
              });
            });
            console.log(result);
            return result;
          })
        );

        return semesters.pipe(
          flatMap(codes =>         this.httpService.getSubjects(slug, this.selectedYear$).pipe(
            map(o =>
              o.syllabus.assignments.map(assignmentWrapper => {
                return {
                  module_url: assignmentWrapper.assignment.module_url,
                  // module_id: assignmentWrapper.module_id,
                  name: assignmentWrapper.assignment.module.name,
                  semester: codes[assignmentWrapper.assignment.module_code],
                  code: assignmentWrapper.assignment.module_code,
                  description: assignmentWrapper.assignment.module.description
                };
              })
            )
          ))
        );
      }),
      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
  }




}
