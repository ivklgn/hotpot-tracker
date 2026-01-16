export function timeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const elapsedMilliseconds = now.getTime() - pastDate.getTime();

  // Constants for converting milliseconds to seconds, minutes, hours, and days.
  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${pluralize(days, 'day', 'days', 'days')} ago`;
  } else if (hours > 0) {
    return `${hours} ${pluralize(hours, 'hour', 'hours', 'hours')} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${pluralize(minutes, 'minute', 'minutes', 'minutes')} ago`;
  } else {
    if (seconds === 0) {
      return 'Just now';
    }

    return `${seconds} ${pluralize(seconds, 'second', 'seconds', 'seconds')} ago`;
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

export function isLessThanSecondsOld(dateStr: string, targetSeconds: number): boolean {
  const now = new Date();
  const createdDate = new Date(dateStr);
  const diffInSeconds = (now.getTime() - createdDate.getTime()) / 1000;
  return diffInSeconds < targetSeconds;
}
