export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDateTimeForDisplay = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export const calculateTimeRemaining = (limitString) => {
  if (!limitString) return null;

  const limitDate = new Date(limitString);
  if (isNaN(limitDate.getTime())) return null;

  const now = new Date();
  const diffMs = limitDate.getTime() - now.getTime();

  if (diffMs < 0) {
    return { isOverdue: true, text: '期限切れ' };
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;

    if (remainingHours > 0) {
      return { isOverdue: false, text: `${diffDays}日${remainingHours}時間${remainingMinutes}分` };
    } else {
      return { isOverdue: false, text: `${diffDays}日${remainingMinutes}分` };
    }
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

  const now = new Date();
  return limitDate.getTime() < now.getTime();
};

export const convertToServerFormat = (dateTimeLocalString) => {
  if (!dateTimeLocalString) return null;

  const date = new Date(dateTimeLocalString);
  if (isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 19);
};
