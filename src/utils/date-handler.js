import {
  parseISO,
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  getTime,
  isValid,
} from 'date-fns';

export const formattedDate = (date, DateFormat = 'dd MMM, yyyy') => (date ? format(new Date(date), DateFormat) : '-');

export const currentTimeInMilliSeconds = () => {
  return getTime(new Date());
};

export function calculateDaysPassed(date) {
  const currentDate = new Date();
  const daysPassed = differenceInDays(currentDate, date);

  return daysPassed;
}

export const formattedTimeDate = (date) => {
  if (!date) return '-';

  const optionsTime = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const optionsDate = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const timeFormat = new Intl.DateTimeFormat('en-US', optionsTime).format(new Date(date));
  const dateFormat = new Intl.DateTimeFormat('en-US', optionsDate).format(new Date(date));

  return `${timeFormat} ${dateFormat}`;
};

export const formatDateTimeForAPI = (time = '12:34pm', entryDateStr) => {
  const timeString = typeof time === 'string' ? time : time?.time;

  try {
    const match = timeString?.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);

    if (!match) {
      throw new Error('Invalid time format');
    }

    let [, hours, minutes, meridiem] = match;
    hours = parseInt(hours, 10);

    if (meridiem.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;

    const entryDate = entryDateStr ? new Date(entryDateStr) : new Date();

    const formattedEntryDate = new Date(entryDate.getTime() - entryDate.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    return `${formattedEntryDate}T${formattedTime}:00`;
  } catch (error) {
    console.error('Error:', error);

    return null;
  }
};

// NOTE: Current time as default value (12:29 pm)
export const getCurrentTime = (time) => {
  const now = time ? new Date(time) : new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const meridiem = hours >= 12 ? 'pm' : 'am';
  const formattedHours = (hours % 12 || 12)?.toString()?.padStart(2, '0');
  const formattedMinutes = minutes?.toString()?.padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${meridiem}`;
};

export function formatedDate(isoDateString) {
  const date = new Date(isoDateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

// NOTE: commented for now to observe any negative outcomes

export const formattedToSecond = (date) => {
  const parsedTimestamp = parseISO(date);

  const minutes = Math.floor(differenceInSeconds(new Date(), parsedTimestamp) / 60);
  const seconds = differenceInSeconds(new Date(), parsedTimestamp) % 60;

  return ` ${minutes}:${seconds}`;
};

export function extractMinutesAndSeconds(dateString) {
  const date = new Date(dateString);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${minutes}:${seconds}`;
}

export function formatTime(seconds) {
  seconds = Math.ceil(seconds);
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  return formattedMinutes + ':' + formattedSeconds;
}

export function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return yesterday;
}

export function formatRelativeTime(isoDateString) {
  if (!isoDateString) return '-';

  try {
    const date = parseISO(isoDateString);
    if (!isValid(date)) throw new Error('Invalid date');

    const now = new Date();
    const seconds = differenceInSeconds(now, date);
    const minutes = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const formattedDate = format(date, 'dd MMMM yyyy');
    const formattedTime = format(date, 'hh:mm a');

    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    console.error('Error formatting relative time:', error);

    return '-';
  }
}

export function formatTimeToMinutes(timeString) {
  if (!timeString) return '';
  const [minutes, seconds] = timeString.split(':').map(Number);
  const totalTimeInMinutes = minutes + seconds / 60;
  const minutesPart = Math.floor(totalTimeInMinutes);
  const secondsPart = Math.round((totalTimeInMinutes - minutesPart) * 60);

  if (secondsPart === 0) {
    return `${minutesPart} min`;
  } else {
    return `${minutesPart}.${secondsPart} min`;
  }
}
