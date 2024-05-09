import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StudyTableComponent } from './components/study-table/study-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MatToolbarModule, StudyTableComponent],
})
export class AppComponent {
  title = 'clinicaltrials';
}
