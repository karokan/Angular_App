import { Component } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { HttpService } from './http.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private httpService: HttpService) {}
  title = 'Angular-Praca';

  // lista wydziałów do wyświetlenia w dropdownie
  public listOfFaculties: Array<string> = [ 'eaiiib', 'eip', 'fiis', 'ggiiś', 'ggioś'];
  list: string[] = [];

 // opcja bez subskrybowania za to z "async pipe"
  // spelcjalny pipe wyswietla dane od razu w naszym widoku bez subskrybowania
  // tworzenie observable
  allSubjects$: Observable<any>;
  FieldsOfStudy$: Observable<any>;
  SubjectsField$: Observable<any>;
  allPosts$: Observable<Array<string>>;
  semestr$: string;
  wydzial$: string;
  // player: string;
  testArray$: Array <string> = ['stacjonarne-automatyka-i-robotyka--5'];
  kierunek$: string;
  kierunekTogetSubjectsFromFaculty$: string;



  // posts zmienna do której wpadają dane z jsona poprzez observable i subksrypcje
   getPosts() {
    for (let i = 0; i < this.testArray$.length; i++) {
      this.kierunek$ = this.testArray$[i];
      console.log(this.kierunek$);
      this.allSubjects$ = this.httpService.getPosts(this.kierunek$).pipe(
      map(o => JSON.stringify(o) + 'hkjhk')
    );
    }
  }

  getKot() {
    // console.log(this.semestr$);
    console.log('Ala ma kota');
  }

  // bez sybskrypcji linijka 17**
  // do tego observable ktorego stworzylismy - linijka 20** dopisujemy to co zwraca nasze zapytania


  // pobieram wszystkie przedmioty z wydziału, pobiera kierunki z zainicjalizowanej tablicy (trzeba zrobić tak żeby pobierało
  // tylko nazwy kierunków a nie wszystkie dane)
  getSubjects() {
    for (let i = 0; i < this.testArray$.length; i++) {
      this.kierunek$ = this.testArray$[i];
      console.log(this.kierunek$);
      this.allSubjects$ = this.httpService.getSubjects(this.kierunek$, this.semestr$).pipe(
        map(o => o.syllabus.assignments.map(assignment => JSON.stringify(assignment.module_code)))
        );
    }
  }
  // próba dostania sie do 'name' z tej scieżki "Dane wszystkich modułów przypisanych do wybranego programu studiów" api
  // getSubjects() {
  //     for (let i = 0; i < this.testArray$.length; i++) {
  //       this.kierunek$ = this.testArray$[i];
  //       console.log(this.kierunek$);
  //       this.allSubjects$ = this.httpService.getSubjects(this.kierunek$).pipe(
  //       map(o => o.syllabus),
  //       map(syllabus => syllabus.assignments),
  //       map(assignments => assignments.module),
  //       map(module => module.name)

  //     );
  //     }
  //   }



//pobiera (nazwy) wszystkie kierunki na danym wydziale na danym semestrze
  getFieldsOfStudy() {
      //this.list = [];
      console.log(this.semestr$);
      this.FieldsOfStudy$ = this.httpService.getFieldsOfStudy(this.semestr$, this.wydzial$).pipe(
        map(o => o.syllabus),
        // tslint:disable-next-line: max-line-length
        map(syllabus => syllabus.study_types
          .flatMap(studyType => studyType.levels
            .flatMap(level => level.study_programmes
            .flatMap(subject => subject.name))))

      );

      this.FieldsOfStudy$.subscribe(table =>  {
        //console.log('dupa:');
        this.list = table;
        //console.log(this.list);
        console.log(this);
        });

      console.log(this);
     // console.log(this.list);


     // console.log(this.listOfFaculties);





      //console.log(this.list);


      // this.httpService.getFieldsOfStudy().pipe(
      //   map(o => o.syllabus),
      //   map(syllabus => syllabus.study_types[0].levels[0].study_programmes),
      //   flatMap(array => from(array)),
      //   map(subject => subject.name)

      // ).subscribe( x => this.list$.push(x))
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




}

export interface Post {
  id?: number;
  name?: string;
  owner?: Array<string>;
  lecturers?: Array<string>;
  study_plans?: Array<string>;
  ects_points?: number;

}

