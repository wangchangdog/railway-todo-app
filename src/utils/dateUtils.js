import { format, differenceInMinutes, differenceInHours, differenceInDays, isPast } from 'date-fns';

export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
};

export const formatDateTimeForDisplay = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'yyyy/MM/dd HH:mm');
};

export const calculateTimeRemaining = (limitString) => {
  if (!limitString) return null;
  const limitDate = new Date(limitString);
  if (isNaN(limitDate.getTime())) return null;

  if (isPast(limitDate)) {
    return { isOverdue: true, text: '期限切れ' };
  }

  const now = new Date();
  const diffMinutes = differenceInMinutes(limitDate, now);

  if (diffMinutes <= 1) {
    return { isOverdue: false, text: '残りわずか' };
  }

  const diffHours = differenceInHours(limitDate, now);
  const diffDays = differenceInDays(limitDate, now);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;
    if (remainingHours > 0) {
      return { isOverdue: false, text: `${diffDays}日${remainingHours}時間${remainingMinutes}分` };
    }
    return { isOverdue: false, text: `${diffDays}日${remainingMinutes}分` };
  } else if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return { isOverdue: false, text: `${diffHours}時間${remainingMinutes}分` };
  } else {
    return { isOverdue: false, text: `${diffMinutes}分` };
  }
};

export const isOverdue = (limitString) => {
  if (!limitString) return false;
  const limitDate = new Date(limitString);
  if (isNaN(limitDate.getTime())) return false;
  return isPast(limitDate);
};

export const convertToServerFormat = (dateTimeLocalString) => {
  if (!dateTimeLocalString) return '';
  const date = new Date(dateTimeLocalString);
  if (isNaN(date.getTime())) return '';
  // Convert to ISO 8601 UTC string (e.g., "2023-12-12T23:59:59.000Z")
  const isoString = date.toISOString();
  // Truncate milliseconds and ensure 'Z' suffix
  return isoString.slice(0, 19) + 'Z';
};