import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { HttpService } from './http.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, from, empty, EMPTY, concat } from 'rxjs';
import { map, flatMap, tap,  reduce, mergeAll, toArray, filter } from 'rxjs/operators';


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
  FieldsOfStudy$: Observable<any>;
  SubjectsField$: Observable<any>;
  allPosts$: Observable<any>;
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

fireEvent(event){
  console.log("Mouse działa:" + event);
}

clickSubject(){
  console.log("kliknąłeś w PRZEDMIOT !!!!!!!!!!!!!!!!!")
}

  // uses result of one http call to perform another
  getTwoPhasesSimple() {
    this.twoPhasesSimple = this.httpService.getAllModulesByStudyMode().pipe(
      map(o => o.syllabus.assignments[0].assignment.module_code),               // take the result of first http call and map it to module code of first assignment
      flatMap(moduleId => this.httpService.getModuleByStudyMode(moduleId)),     // maps moduleId to another http call. map would be used then we would have Observale<Oservable<any>>. flatMap unpacks inner observable. so we have Observale<any>
      map(o => JSON.stringify(o.syllabus.assignments[0].assignment, null, 2))   // maps result of second call to something that we could display
    )
  }


  // uses result of one http call to perform variable number of calls.
  getTwoPhasesAdvanced() {
    this.twoPhasesAdvanced = this.httpService.getAllModulesByStudyMode().pipe(
      // take the result of first call and map it
      map(o => o.syllabus.assignments),
      // observable<array<assignmentObject>>           //this observable contains single array

      // map each object in array to module_code
      map(assignments => assignments.map(assignmentObject => assignmentObject.assignment.module_code)),
      // observable<array<module_code>>                //this observable contains single array

      // map the array to observable and flat it (to have observable of module_code instead of obsevable of observable of module code)
      flatMap(module_codes => from(module_codes)),
      // observable<module_code>                       //this observable contains multiple module_codes

      // flatMap every module_code to another http call (resulting in observables)
      flatMap(module_code => this.httpService.getModuleByStudyMode(module_code as string)),   //we need to provide type for typechecker
      // observable<module_object>                     //this observable contains multiple results of http calls for each module_code

      // map every module_object to something that can be displayed
      map(o =>  JSON.stringify(o.syllabus.assignments[0].assignment, null, 2)),
      // observable<string>                            //this observable contains multiple strings

      // now turn it back to an observable that contains single array
      toArray()
      // observable<array<string>>
    )
  }



  // posts zmienna do której wpadają dane z jsona poprzez observable i subksrypcje
   getPosts() {
    for (let i = 0; i < this.testArray$.length; i++) {
      this.kierunek$ = this.testArray$[i];
      console.log(this.kierunek$);
      this.allPosts$ = this.httpService.getPosts().pipe(
      map(o => JSON.stringify(o) + 'hkjhk')
    );
    }

   // console.log(this.listOfNames[0]);
  }

  getKot() {
    // console.log(this.semestr$);
    console.log('Ala ma kota');
  }

  // bez sybskrypcji linijka 17**
  // do tego observable ktorego stworzylismy - linijka 20** dopisujemy to co zwraca nasze zapytania

  // getTest() {
  //   for (let i = 0; i < this.testArray$.length; i++) {
  //     this.kierunek$ = this.testArray$[i];
  //     console.log(this.kierunek$);
  //     this.urlForSlug = this.httpService.getTest().pipe(
  //       map(o => o.syllabus),
  //       map(syllabus => (JSON.stringify(syllabus) + " ala ma kota"))
  //       );
  //   }
  // }

  // Pobiera URL z "Lista programów studiów danego wydziału" po to aby potem z nich wyciągnać slugi // zapisywanie urli do tablicy listOfUrl
  // lepiej to bedzie pobierac w ngOnInit ale zrobi się to później // przeniesione do ngOnInit
  // getUrlForSlug() {
  //     this.urlForSlug$ = this.httpService.getUrlForSlug().pipe(map(o => o.syllabus),
  //     map(syllabus => syllabus.study_types
  //       .flatMap(studyType => studyType.levels //flatmapa potrzebna gdy tablica w tablicy
  //         .flatMap(level => level.study_programmes
  //         .flatMap(subject => subject.url))))
  //       );

  //     this.urlForSlug$.subscribe((res : string[])=> {
  //       //console.log(res);
  //       this.listOfUrl = res;
  //       console.log(this.listOfUrl[0]);
  //     })
  // }




  getSubjectsWithQuery() {
    this.allSubjectsWithQuery$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => assignmentWrapper.assignment.module.name))
        )),
      flatMap(a => from(a)),
      filter((subject: string) => subject.indexOf(this.query$) >= 0),
      toArray(),
      map(a => {console.log(a); return a;})
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


   // pobieram wszystkie przedmioty z wydziału, pobiera kierunki z zainicjalizowanej tablicy (trzeba zrobić tak żeby pobierało
  // tylko nazwy kierunków a nie wszystkie dane)
  getSubjectsWithName() {
    this.allSubjects$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => { return {
            name: assignmentWrapper.assignment.module.name,
            code: assignmentWrapper.assignment.module_code,
            description: assignmentWrapper.assignment.module.description
          }}))
        )),
      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
  }

  // pobieram wszystkie nazwy, wszystkich przedmiotów na danym roku
  getAllSubjectsWithName() {
    this.allSubjectsInYear$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => { return {
            name: assignmentWrapper.assignment.module.name,
          }}))
        )),
      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
  }

  // nie działa, próba dostania się do description przedmiotu (tego głębszego)
  getSubjectsWithQueryInLecture() {
    this.allSubjectsLecture$ = from(this.slug$).pipe(
      flatMap(slug => this.httpService.getSubjects(slug, this.selectedYear$).pipe(
        map(o => o.syllabus.assignments
          .map(assignmentWrapper => assignmentWrapper.module
            .map(moduleActivitiesWrapper => moduleActivitiesWrapper.module_activities
              .map(moduleActivityWrapper => {return{
                classesHours: moduleActivityWrapper.module_activity.classes_hours
              }})
              ))))),


      flatMap(a => from(a)),
      toArray()
      //map(a => {console.log(a); return a;})
    );
    }



// pobiera (nazwy) wszystkie kierunki na danym wydziale na danym semestrze
  getFieldsOfStudy() {
      //console.log(this.semestr$);
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

          //map(a => {console.log(a); return a;})
      );

      // this.FieldsOfStudy$.subscribe((res : string[])=> {
      //   //console.log(res);
      //   this.listOfNames = res;
      //   //console.log(this.listOfNames[3]);
      //  // this.getPosts(this.listOfNames[0]);
      // });
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




}

export interface Post {
  id?: number;
  name?: string;
  owner?: Array<string>;
  lecturers?: Array<string>;
  study_plans?: Array<string>;
  ects_points?: number;

}

