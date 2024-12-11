/**
 * Format a date to a localized string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format time only
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diff / (1000 * 60));

  if (diffDays > 0) return `in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  if (diffDays < 0) return `${Math.abs(diffDays)} day${diffDays === -1 ? '' : 's'} ago`;
  if (diffHours > 0) return `in ${diffHours} hour${diffHours === 1 ? '' : 's'}`;
  if (diffHours < 0) return `${Math.abs(diffHours)} hour${diffHours === -1 ? '' : 's'} ago`;
  if (diffMinutes > 0) return `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
  if (diffMinutes < 0) return `${Math.abs(diffMinutes)} minute${diffMinutes === -1 ? '' : 's'} ago`;
  return 'just now';
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
  return new Date(date) > new Date();
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

/**
 * Get available time slots for a given date
 * @param date The date to get time slots for
 * @param duration Duration of each slot in minutes
 * @param startHour Opening hour (24-hour format)
 * @param endHour Closing hour (24-hour format)
 * @param excludedTimes Array of times to exclude
 */
export const getTimeSlots = (
  date: Date,
  duration: number = 30,
  startHour: number = 9,
  endHour: number = 17,
  excludedTimes: string[] = []
): string[] => {
  const slots: string[] = [];
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  while (start < end) {
    const timeString = formatTime(start);
    if (!excludedTimes.includes(timeString)) {
      slots.push(timeString);
    }
    start.setMinutes(start.getMinutes() + duration);
  }

  return slots;
};
