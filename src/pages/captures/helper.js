export const initialFilters = { page: 1, perPage: 25, type: [], sortOn: 'createdAt', sortBy: 'desc' };

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getToday = () => {
  const today = new Date();

  return {
    startDate: formatDate(today),
    endDate: formatDate(today),
  };
};

export const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    startDate: formatDate(yesterday),
    endDate: formatDate(yesterday),
  };
};

export const getThisWeek = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  const startDate = formatDate(firstDayOfWeek);
  const endDate = formatDate(today);

  return { startDate, endDate };
};

export const getLastWeek = () => {
  const today = new Date();
  const lastMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
  const lastSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startDate = formatDate(lastMonday);
  const endDate = formatDate(lastSunday);

  return { startDate, endDate };
};

export const getYesterdayToToday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    startDate: formatDate(yesterday),
    endDate: formatDate(today),
  };
};

export const dateOptions = [
  {
    label: 'Today',
    value: getToday(),
  },
  {
    label: 'Yesterday',
    value: getYesterday(),
  },
  {
    label: 'This Week',
    value: getThisWeek(),
  },
  {
    label: 'Last Week',
    value: getLastWeek(),
  },
  {
    label: 'Custom Range',
    value: getYesterdayToToday(),
  },
];

export const typeOptions = [
  { label: 'Tab Recording', value: 'currentTab' },
  { label: 'Screen Recording', value: 'fullScreen' },
  { label: 'Full Page Screenshot', value: 'fullPageScreenshot' },
  { label: 'Visible Area Screenshot', value: 'visibleScreenshot' },
  { label: 'Selected Area Screenshot', value: 'selectedAreaScreenshot' },
];

export const sortOptions = [
  { label: 'Date Created', value: 'createdAt' },
  { label: 'Type', value: 'type' },
];
