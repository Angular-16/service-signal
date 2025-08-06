import { computed, Injectable, signal } from '@angular/core';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  /** Приватный сигнал, содержащий массив вопросов теста */
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

  /** Публичная read-only версия сигнала, содержащего массив вопросов теста */
  readonly userQuestions = this.#userQuestions.asReadonly();

  /** Приватный сигнал для хранения индексов выбранных пользователем */
  readonly #userAnswers = signal<number[]>([]);

  /** Публичная read-only версия сигнала для хранения индексов выбранных пользователем */
  readonly userAnswers = this.#userAnswers.asReadonly();

  readonly #isBusy = signal<boolean>(false);
  readonly isBusy = this.#isBusy.asReadonly();

  /** Текущий индекс вопроса определяется количеством данных ответов */
  readonly currentQuestionIndex = computed(() => this.#userAnswers().length);

  /** Текущий вопрос извлекается из массива по текущему индексу */
  readonly currentQuestion = computed(
    () => this.#userQuestions()[this.currentQuestionIndex()]
  );

  /** Общее количество вопросов в тесте */
  readonly userQuestionsCount = computed(() => this.#userQuestions().length);

  /** Флаг, указывающий, завершён ли тест (когда количество ответов равно количеству вопросов) */
  readonly isQuizDone = computed(
    () => this.currentQuestionIndex() === this.userQuestionsCount()
  );
}
