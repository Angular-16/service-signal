export interface Question {
  /** Текст вопроса */
  readonly caption: string;
  /** Варианты ответов */
  readonly answers: string[];
  /** Индекс правильного ответа в массиве answers */
  readonly correctAnswerIndex: number;
}
