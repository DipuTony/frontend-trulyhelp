import moment from 'moment';

// Format 1: Full Month, Day with ordinal, Year (e.g., October 13th, 2024)
export const formatDateFull = (date) => moment(date).format('MMMM Do, YYYY');

// Format 2: Short Month, Day, Year (e.g., Oct 13, 2024)
export const formatDateShort = (date) => moment(date).format('MMM DD, YYYY');

// Format 3: Day/Month/Year (e.g., 13/10/2024)
export const formatDateDMY = (date) => moment(date).format('DD/MM/YYYY');

// Format 4: Month/Day/Year (e.g., 10/13/2024)
export const formatDateMDY = (date) => moment(date).format('MM/DD/YYYY');

// Format 5: Year-Month-Day (ISO format) (e.g., 2024-10-13)
export const formatDateISO = (date) => moment(date).format('YYYY-MM-DD');

// Format 6: Time in 24-hour format (e.g., 14:30)
export const formatTime24Hour = (date) => moment(date).format('HH:mm');

// Format 7: Time with AM/PM (e.g., 02:30 PM)
export const formatTime12Hour = (date) => moment(date).format('hh:mm A');

// Format 8: Full Date and Time (e.g., October 13th, 2024 2:30 PM)
export const formatDateTimeFull = (date) => moment(date).format('MMMM Do, YYYY hh:mm A');

// Format 9: Relative time from now (e.g., 2 days ago, in 3 hours)
export const formatRelativeTime = (date) => moment(date).fromNow();

// Format 10: Custom date (Weekday, Day, Short Month, Year) (e.g., Sun, 13 Oct 2024)
export const formatCustomDate = (date) => moment(date).format('ddd, DD MMM YYYY');
