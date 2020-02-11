import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { FacultyListComponent } from './faculties/faculty-list/faculty-list.component';
import { FacultyFieldsComponent } from './faculties/faculty-fields/faculty-fields.component';
import { FacultySingleComponent } from './faculties/faculty-list/faculty-single/faculty-single.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { BlankFieldsListComponent } from './blankFields/blank-fields-list/blank-fields-list.component';
import { SearchSubjectListComponent } from './searchSubject/search-subject-list/search-subject-list.component';
import { ShowSubjectsListComponent } from './showSubjects/show-subjects-list/show-subjects-list.component';
import { ShowAllSubjectsListComponent } from './showAllSubjects/show-all-subjects-list/show-all-subjects-list.component';
import { CompareFieldsOfStudyListComponent } from './compareFieldsOfStudy/compare-fields-of-study-list/compare-fields-of-study-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FacultiesComponent,
    FacultyListComponent,
    FacultyFieldsComponent,
    FacultySingleComponent,
    DropdownDirective,
    BlankFieldsListComponent,
    SearchSubjectListComponent,
    ShowSubjectsListComponent,
    ShowAllSubjectsListComponent,
    CompareFieldsOfStudyListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
