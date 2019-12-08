import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Faculty } from '../../faculties.model'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faculty-single',
  templateUrl: './faculty-single.component.html',
  styleUrls: ['./faculty-single.component.css']
})
export class FacultySingleComponent implements OnInit {
  //@Input() faculty: Faculty = new Faculty();
  //@Input() faculty: {type: string; name: string};
  @Input() faculty: Observable<any>;



  constructor() { }

  ngOnInit() {
  }

}
