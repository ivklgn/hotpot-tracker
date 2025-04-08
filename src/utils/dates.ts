export function timeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const elapsedMilliseconds = now.getTime() - pastDate.getTime();

  // TODO: to english
  // Константы для преобразования миллисекунд в секунды, минуты, часы и дни
  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${pluralize(days, 'день', 'дня', 'дней')} назад`;
  } else if (hours > 0) {
    return `${hours} ${pluralize(hours, 'час', 'часа', 'часов')} назад`;
  } else if (minutes > 0) {
    return `${minutes} ${pluralize(minutes, 'минуту', 'минуты', 'минут')} назад`;
  } else {
    if (seconds === 0) {
      return 'Только что';
    }

    return `${seconds} ${pluralize(seconds, 'секунду', 'секунды', 'секунд')} назад`;
  }
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return one;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return few;
  } else {
    return many;
  }
}
