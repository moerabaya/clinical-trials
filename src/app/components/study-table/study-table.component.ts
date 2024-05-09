import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StudyService } from '../../services/study/study.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-study-table',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressBarModule, MatTableModule],
  templateUrl: './study-table.component.html',
  styleUrl: './study-table.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '400ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class StudyTableComponent implements OnInit {
  items: Study[] | undefined;
  loading: boolean = false;

  constructor(
    private studyService: StudyService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.studyService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    this.studyService.getItems().subscribe(
      items => {
        this.items = items;
      },
      () => {
        this.snackBar.open('Error occurred while fetching data!', 'Close', {
          duration: 5000,
        });
      }
    );
  }
}
