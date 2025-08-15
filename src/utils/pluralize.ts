export function pluralizeMessages(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return `${count} сообщений`;
  }

  if (mod10 === 1) {
    return `${count} сообщение`;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} сообщения`;
  }

  return `${count} сообщений`;
}
