export class ListTodosDto {
  dueDate?: string;
  page?: number = 1;
}

export enum dueDateFilterEnum {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  THIS_WEEK = 'THIS_WEEK',
  NEXT_WEEK = 'NEXT_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  NEXT_MONTH = 'NEXT_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  OVERDUE = 'OVERDUE',
}
