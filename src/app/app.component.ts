import { Component, inject } from '@angular/core';
import { QuestionPresenterComponent } from './components/question-presenter/question-presenter.component';
import { ProgressComponent } from './components/progress/progress.component';
import { DoneComponent } from './components/done/done.component';
import { ExamService } from './services/exam.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionPresenterComponent, ProgressComponent, DoneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly store = inject(ExamService);
}
