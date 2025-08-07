import { computed, inject, Injectable, signal } from '@angular/core';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamGeneratorService } from './exam-generator.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  // Уровень сложности
  generator = inject(ExamGeneratorService);

  readonly #difficultyLevel = new BehaviorSubject<number>(1);

  decreaseLevel(): void {
    this.#difficultyLevel.next(this.#difficultyLevel.value - 1);
  }

  increaseLevel(): void {
    this.#difficultyLevel.next(this.#difficultyLevel.value + 1);
  }

  repeatLevel(): void {
    this.#difficultyLevel.next(this.#difficultyLevel.value);
  }

  level = toSignal(this.#difficultyLevel);

  constructor() {
    this.#difficultyLevel
      .pipe(
        tap((_: number) => this.#isBusy.set(true)),
        switchMap((level) => this.generator.generateExam(level)),
        tap((questions: Question[]) => {
          this.#userQuestions.set(questions);
          this.#userAnswers.set([]);
          this.#isBusy.set(false);
        })
      )
      .subscribe();
  }

  /** Приватный сигнал, содержащий массив вопросов теста */
  readonly #userQuestions = signal<Question[]>([]);

  /** Публичная read-only версия сигнала, содержащего массив вопросов теста */
  readonly userQuestions = this.#userQuestions.asReadonly();

  /** Приватный сигнал для хранения индексов выбранных пользователем */
  readonly #userAnswers = signal<number[]>([]);

  /** Публичная read-only версия сигнала для хранения индексов выбранных пользователем */
  readonly userAnswers = computed(() =>
    this.#userAnswers().map<Answer>((userAnswer: number, index: number) => {
      return {
        userAnswerIndex: userAnswer,
        isCorrect:
          userAnswer === this.#userQuestions()[index].correctAnswerIndex,
      } as Answer;
    })
  );

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
    () => this.#userAnswers().length === this.userQuestionsCount()
  );

  readonly correctAnswers = computed(() =>
    this.userAnswers().filter((answer: Answer) => answer.isCorrect)
  );

  readonly correctAnswersCount = computed(() => this.correctAnswers().length);

  answerCurrentQuestion(answerIndex: number): void {
    this.#userAnswers.update((answers: number[]) => [...answers, answerIndex]);
  }
}
