import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StudyService } from '../../services/study/study.service';

@Component({
  selector: 'app-study-table',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressBarModule, MatTableModule],
  templateUrl: './study-table.component.html',
  styleUrl: './study-table.component.scss',
})
export class StudyTableComponent implements OnInit {
  items: Study[] | undefined;
  loading: boolean = false;

  constructor(private studyService: StudyService) {}
  ngOnInit(): void {
    this.studyService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    this.studyService.getItems().subscribe(items => {
      this.items = items;
    });
  }
}
