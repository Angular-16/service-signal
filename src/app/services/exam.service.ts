import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  readonly #userQuestions = signal<Question[]>([
    {
      caption: 'How much is 4 + 4?',
      answers: ['4', '6', '8', '12'],
      correctAnswerIndex: 1,
    },
    {
      caption: 'How much is 5 + 5?',
      answers: ['5', '10', '15', '20'],
      correctAnswerIndex: 1,
    },
    {
      caption: 'How much is 6 + 6?',
      answers: ['6', '12', '18', '24'],
      correctAnswerIndex: 1,
    },
  ]);
  readonly userQuestions = this.#userQuestions.asReadonly();

  readonly #userAnswers = signal<number[]>([]);
  readonly userAnswers = this.#userAnswers.asReadonly();

  readonly #isBusy = signal<boolean>(false);
  readonly isBusy = this.#isBusy.asReadonly();

  readonly currentQuestionIndex = computed(() => this.#userAnswers().length);
  readonly currentQuestion = computed(
    () => this.#userQuestions()[this.currentQuestionIndex()]
  );

  readonly userQuestionsCount = computed(() => this.#userQuestions().length);
  readonly isQuizDone = computed(
    () => this.currentQuestionIndex() === this.userQuestionsCount()
  );
}
