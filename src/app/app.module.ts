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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FacultiesComponent,
    FacultyListComponent,
    FacultyFieldsComponent,
    FacultySingleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
