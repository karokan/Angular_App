import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { HttpService } from './http.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, from} from 'rxjs';
import { map, flatMap, toArray, filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //@Input() semestr$: string = '2017-2018';
  selected = 'option2';



  constructor(private httpService: HttpService) {}
  title = 'Angular-Praca';

  // lista wydziałów do wyświetlenia w dropdownie
  public listOfFaculties: Array<string> = [ 'eaiiib', 'eip', 'fiis', 'ggiiś', 'ggioś'];
  listOfUrl: string[] = [];
  listOfNames: string[] = [];

  k: number =0;

 // opcja bez subskrybowania za to z "async pipe"
  // spelcjalny pipe wyswietla dane od razu w naszym widoku bez subskrybowania
  // tworzenie observable
  allSubjects$: Observable<any>;
  allSubjectsInYear$: Observable<any>;
  allSubjectsLecture$: Observable<any>;
  allSubjectsWithQuery$: Observable<any>;
  getDescriptionOfSubjects$: Observable<any>;
  allSubjectsWithIdAndQuery$: Observable<any>;
  FieldsOfStudy$: Observable<any>;
  SubjectsField$: Observable<any>;
  allPosts$: Observable<any>;
  allPostsv2$: Observable<any>;
  testowyNgOnInit$: Observable<any>;
  semestr$: string = '2013-2014';
  wydzial$: string = 'wgig';
  item$: string;

  wydzialDropDown$: Array <string> = ['weaiiib', 'weip', 'wfiis', 'wggiis', 'wggios', 'wgig', 'wh','wieit', 'wimic', 'wimiip', 'wimir','wmn','wms', 'wo', 'wwnig', 'wz'];
  semestrDropDown$: Array <string> = ['2012-2013', '2013-2014', '2014-2015', '2015-2016', '2016-2017', '2017-2018', '2018-2019', '2019-2020'];
  selectedFaculty$: string = 'weaiiib';
  selectedYear$: string = '2017-2018';

  testArray$: Array <string> = ['stacjonarne-automatyka-i-robotyka--5', 'stacjonarne-elektrotechnika--3'];
  kierunek$: string;
  kierunekTogetSubjectsFromFaculty$: string;
  urlForSlug$: Observable<any>;

  // do przykładu: Używanie httprequesta w innym httprequescie
  twoPhasesSimple: Observable<any>;
  twoPhasesAdvanced: Observable<any>;

  slugNumberInUrl: number;
  slug$: string[]=[];
  temporary$: string[]=[];
  query$: string ='';

  loadedFeature = 'faculty';

  onNavigate(feature: string){
    this.loadedFeature = feature;
  }

    // getSubjectsField(){
    //   this.SubjectsField$ = this.httpService.getSubjectsField().pipe(
    //     map(o => o.syllabus),
    //     map(syllabus => syllabus.)
    //   )

    // }

    // let i=0;
    // this.httpService.getPosts().subscribe(
    //   response => {
    //     let lecturers =  response["lecturers"];
    //     let lecture = lecturers[0];
    //     console.log(response);
    //   });


    // Pobieranie danych z api w trakcie uruchomienia programu
    ngOnInit() {

     this.onChange(this.selectedFaculty$);



    //   for(let i=0; i<this.wydzialDropDown$.length; i++){

    //     this.item$ =  this.wydzialDropDown$[i];
    //   this.urlForSlug$ = this.httpService.getUrlForSlug(this.item$, this.selectedYear$).pipe(map(o => o.syllabus),
    //   map(syllabus => syllabus.study_types
    //     .flatMap(studyType => studyType.levels
    //       .flatMap(level => level.study_programmes
    //       .flatMap(subject => subject.url))))
    //     );

    // this.urlForSlug$.subscribe((res : string[]) => {
    //     //console.log(res);
    //     this.listOfUrl = res;
    //     console.log(this.listOfUrl[0]);

    //     for(let j=0; j < this.listOfUrl.length; j++){
    //       this.slugNumberInUrl = this.listOfUrl[j].lastIndexOf("/");  // podaje numer ostatniego wystąpienia wystąpienia podtekstu

    //       this.slug$.push(this.listOfUrl[j].substr(this.slugNumberInUrl + 1 )); // pobiera kawałek tekstu, pramter to poczatek pobieranego kawałka tekstu
    //       //this.k++;
    //       //console.log(this.slug$);
    //       }
    //       //this.k--;
    //   });
    // }
}

      onChange(event) {

              this.urlForSlug$ = this.httpService.getUrlForSlug(event, this.selectedYear$).pipe(map(o => o.syllabus),
        map(syllabus => syllabus.study_types
          .flatMap(studyType => studyType.levels
            .flatMap(level => level.study_programmes
            .flatMap(subject => subject.url))))
          );

              this.urlForSlug$.subscribe((res: string[]) => {
              this.listOfUrl = res;

          for(let i=0; i < this.listOfUrl.length; i++){
            this.slugNumberInUrl = this.listOfUrl[i].lastIndexOf("/");

            this.slug$[i] = this.listOfUrl[i].substr(this.slugNumberInUrl + 1 );
            //console.log(this.slug$);
            }
        });

}

fireEvent(event){
  console.log("Mouse działa:" + event);
}


clickSubject(i){
  console.log("kliknąłeś w PRZEDMIOT !!!!!!!!!!!!!!!!!");
  console.log(this.slug$[i]);
}




  getPostsv2() {
    for (let i = 0; i < this.testArray$.length; i++) {
      this.kierunek$ = this.testArray$[i];
      console.log(this.kierunek$);
      this.allPostsv2$ = this.httpService.getPostsv2().pipe(
        map(o => JSON.stringify(o, null, 2))
    );
    }
   // console.log(this.listOfNames[0]);
  }

  getKot() {
    // console.log(this.semestr$);
    console.log('Ala ma kota');
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





    // for (let i = 0; i < 3 ; i++) { // przy slug$.length nie wypisuje nic, przy np dlugosci 4 wypisuje tylko odpowiadający
    //   this.kierunek$ = this.slug$[i];
    //   console.log(this.kierunek$);
    //   concat(this.allSubjects$, this.httpService.getSubjects(this.kierunek$, this.semestr$).pipe(
    //     map(o => o.syllabus.assignments
    //       .map(assignmentWrapper => assignmentWrapper.assignment.module.name))
    //     ));

    // }
    // this.allSubjects$.subscribe((res : string[])=>{
    //   console.log(res);
    // })


   // pobieram wszystkie przedmioty z wydziału, pobiera kierunki z zainicjalizowanej tablicy
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

  // nie działa, próba pobrania name i code razem z filtrowaniem
  // getSubjectsWithNameWithId() {
  //   this.allSubjectsWithIdAndQuery$ = from(this.slug$).pipe(
  //     flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
  //       map(o => o.syllabus.assignments
  //         .map(assignmentWrapper => { return {
  //           name: assignmentWrapper.assignment.module.name,
  //           code: assignmentWrapper.assignment.module_code,
  //         };}))
  //       )),
  //     flatMap(a => from(a)),
  //     filter((subject: string) => subject.indexOf(this.query$) >= 0),
  //     toArray(),
  //     map(a => {console.log(a); return a;})
  //     //map(a => {console.log(a); return a;})
  //   );
  // }

  // pobieram wszystkie nazwy, wszystkich przedmiotów na danym roku // potrzebna jest linijka numer 96 w ngOnInit
  getAllSubjectsWithName() {
    this.allSubjectsInYear$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => { return {
            name: assignmentWrapper.assignment.module.name,
          };}))
        )),
      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
  }





// pobiera (nazwy) wszystkie kierunki na danym wydziale na danym semestrze
  getFieldsOfStudy() {
      //console.log(this.semestr$);
      this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(this.selectedYear$, this.selectedFaculty$).pipe(
            map(o => o.syllabus),
            // tslint:disable-next-line: max-line-length
            map(syllabus => syllabus.study_types
              .flatMap(studyType => studyType.levels
                .flatMap(level => level.study_programmes
                .flatMap(subject => {return{
                  type: studyType.type,
                  level: level.level,
                  subject: subject.name,
                };})))),

          flatMap(a => from(a)),
          toArray(),

          //map(a => {console.log(a); return a;})
      );

      this.FieldsOfStudy$.subscribe((res : string[])=> {
        console.log(res);
        this.listOfNames = res;
        console.log(this.listOfNames[3]);
       //this.getPosts(this.listOfNames[0]);
      });
    }

    // skopiowana wersja działąjąca
    // getFieldsOfStudy() {
    //   //console.log(this.semestr$);
    //   this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(this.semestr$, this.wydzial$).pipe(
    //     map(o => o.syllabus),
    //     // tslint:disable-next-line: max-line-length
    //     map(syllabus => syllabus.study_types
    //       .flatMap(studyType => studyType.levels
    //         .flatMap(level => level.study_programmes
    //         .flatMap(subject => subject.name))))

    //   );

    //   this.FieldsOfStudy$.subscribe((res : string[])=> {
    //     //console.log(res);
    //     this.listOfNames = res;
    //     //console.log(this.listOfNames[3]);
    //    // this.getPosts(this.listOfNames[0]);
    //   });
    // }

    // znajduje slug$ w ścieżce url'a // przeniesione do ngOninit
    foundSlugInUrl(){

      for(let i=0; i < this.listOfUrl.length; i++){
      this.slugNumberInUrl = this.listOfUrl[i].lastIndexOf("/");  // podaje numer ostatniego wystąpienia wystąpienia podtekstu

      this.slug$[i] = this.listOfUrl[i].substr(this.slugNumberInUrl + 1 ); // pobiera kawałek tekstu, pramter to poczatek pobieranego kawałka tekstu

      //console.log(this.slug$);
      }

    }

    checkIfFilledDescription(){
      this.getDescriptionOfSubjects$ = from(this.slug$).pipe(
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
      );
    }



      //do szukania pustych miejsc w syllabusie (dla prowadzących) do wypełnienia, to samo co wyżej tylko dostaje się dodatkowo do zewnetrznego obiektu
      // zeby pobrac url
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
            map(a => JSON.stringify(a, null, 2))
          );
         // this.getFieldsOfStudy();

          }


          //szuka w opisach przedmiotów zapytania i potem je zwraca
    getSubjectsWithQueryInLecture() {
      this.allSubjectsLecture$ = from(this.slug$).pipe(
        flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
          map(o => o.syllabus.assignments
            .map(assignmentWrapper => new SimpleModule(assignmentWrapper.assignment.module))
            .filter(simpleActivity => simpleActivity.matches(this.query$))
          )
        )),

        flatMap(a => from(a)),

        toArray(),
        // map(a => JSON.stringify(a, null, 2))
      );
     // this.getFieldsOfStudy();

      }

  }



abstract class Matchable {
    abstract matches(query: string): boolean;

    protected valueMatches(value: string, query: string): boolean {
      if (query == null || query == "") return true;
      return value != null && value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1;
    }
  }

class SimpleActivity extends Matchable {
    type: string;
    description: string;

    constructor(module_activity) {
      super();
      this.type = module_activity.type,
      this.description = module_activity.module_classes.map(m => m.module_class.description).join();
    }

    matches(query: string): boolean {
      return this.valueMatches(this.type, query) || this.valueMatches(this.description, query);
    }
  }

class SimpleModule extends Matchable {
    name: string;
    description: string;
    activities: Array<SimpleActivity>;

    constructor(module) {
      super();
      this.name = module.name,
      this.description = module.description,
      this.activities = module.module_activities.map(activity => new SimpleActivity(activity.module_activity));
    }

    matches(query: string): boolean {
      return this.valueMatches(this.name, query) ||
        this.valueMatches(this.description, query) ||
        this.activities.filter(activity => activity.matches(query)).length > 0;
    }

}


///////////////////////////////////////// Prawie to samo co wyżej ale zrobione żeby można było sprawdzać poszczególne dane (punkt 7 z celów)
//
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

/////////////////////////////////////////////////// Do szukania przedmiotu - wypisuje nazwe, pobieram module_id które wysyłam dalej/////


abstract class Matchablev3 {
  abstract matches(query: string): boolean;

  protected valueMatches(value: string, query: string): boolean {
    if (query == null || query == "") return true;
    return value != null && value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1;
  }
}

class SimpleActivityv3 extends Matchablev3 {
  type: string;
  description: string;

  constructor(module_activity) {
    super();
    this.type = module_activity.type,
    this.description = module_activity.module_classes.map(m => m.module_class.description).join();
  }

  matches(query: string): boolean {
    return this.valueMatches(this.type, query) || this.valueMatches(this.description, query);
  }
}

class SimpleModulev3 extends Matchablev3 {
  name: string;
  literature: string;
  notices: string;
  description: string;
  activities: Array<SimpleActivityv3>;

  constructor(module) {
    super();
    this.name = module.name,
    this.notices = module.notices,
    this.literature = module.literature,
    this.description = module.description,
    this.activities = module.module_activities.map(activity => new SimpleActivityv3(activity.module_activity));
  }

  matches(query: string): boolean {
    return this.valueMatches(this.name, query) ||
      this.valueMatches(this.description, query) ||
      this.activities.filter(activity => activity.matches(query)).length > 0;
  }

}

class SimpleModulev4 extends Matchablev3{
  module_id: string;
  module_url: string;
  module: SimpleModulev3;
  activities: Array<SimpleActivityv3>;

  constructor(assignment) {
    super();
    this.module_id = assignment.module_id;
    this.module_url = assignment.module_url;
    this.module = new SimpleModulev3(assignment.module);
    this.activities = assignment.module.module_activities.map(activity => new SimpleActivityv3(activity.module_activity));
  }

  matches(query: string): boolean {
    return this.valueMatches(this.module_id, query) || this.valueMatches(this.module.name, query)
  }


}


export interface Post {
  id?: number;
  name?: string;
  owner?: Array<string>;
  lecturers?: Array<string>;
  study_plans?: Array<string>;
  ects_points?: number;

}

