export class ListTodosDto {
  dueDate?: string;
}

export enum dueDateFilterEnum {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  THIS_WEEK = 'THIS_WEEK',
  NEXT_WEEK = 'NEXT_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  OVERDUE = 'OVERDUE',
}
