import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatSort } from '@angular/material/sort';
import { GlobalService } from '../global.service';

export class notesDetails {
  title: string;
  timestamp: string;
  id: string;
  text: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataSource: MatTableDataSource<notesDetails>;
  notesObject = {
    id: "",
    title: "",
    text: "",
    timestamp: "",
    editable: false
  }
  isEditableCheck: boolean = true;
  formVisibility: boolean = false;
  summaryVisibility: boolean = false;
  displayedColumns: string[] = ['title', 'timestamp'];
  latestUpdatedNote: any = {id:'',title:'',timestamp:''};
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public global: GlobalService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<notesDetails>([]);
    this.dataSource = new MatTableDataSource<notesDetails>(this.global.notesArr);

    this.dataSource.sort = this.sort;
    setTimeout(() => {
      document.getElementById('firstCol').click();
    })

  }

  openSummary() {
    this.latestUpdatedNote = {};
    this.latestUpdatedNote = this.global.notesArr.reduce((a, b) => {
      return a.timestamp > b.timestamp ? a : b;
    })
    this.summaryVisibility = !this.summaryVisibility
  }

  selectNote(row: object) {
    this.notesObject.id = row['id'];
    this.notesObject.title = row['title'];
    this.notesObject.text = row['text'];
    this.notesObject.editable = row['editable'];
    this.isEditableCheck = row['editable'];
    this.formVisibility = true;
  }

  refreshForm() {
    this.notesObject = {
      id: "",
      title: "",
      text: "",
      timestamp: "",
      editable: false
    }
  }

  saveNote() {

    if (this.notesObject.title != "" && this.notesObject.text != "") {
      if (this.notesObject.id != null && this.notesObject.id != "") { //edit existing
        let index = this.global.notesArr.findIndex(o => o.id === this.notesObject.id);
        this.notesObject.timestamp = String(new Date().getTime());
        this.global.notesArr[index] = this.notesObject;
      } else { //add new 
        this.notesObject.timestamp = String(new Date().getTime());
        this.notesObject.id = String(new Date().getTime()).slice(-8);
        this.global.notesArr.push(this.notesObject);
      }


      this.notesObject = {
        id: "",
        title: "",
        text: "",
        timestamp: "",
        editable: false
      }
      this.dataSource = new MatTableDataSource<notesDetails>(this.global.notesArr);
      this.dataSource.sort = this.sort;
      this.formVisibility = false;
    } else {
      console.log("validation error");
    }



  }

}
