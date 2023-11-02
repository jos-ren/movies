// formats firestore timestamps into human readable strings
export function formatFSTimestamp(timestamp, method) {

  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
  const date = new Date(milliseconds);

  if (method === 1) {
    // Format the date as DD/MM/YYYY hh:mm:ss
    const formatter = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const parts = formatter.formatToParts(date);

    const day = parts.find((part) => part.type === 'day').value;
    const month = parts.find((part) => part.type === 'month').value;
    const year = parts.find((part) => part.type === 'year').value;
    const hour = parts.find((part) => part.type === 'hour').value;
    const minute = parts.find((part) => part.type === 'minute').value;
    const second = parts.find((part) => part.type === 'second').value;

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  } else if (method === 2) {
    // Format the date as "Mon DD, YYYY"
    const formatter = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    // Get the formatted date string
    const formattedDate = formatter.format(date);
    // Replace any leading zero with a space for single-digit days
    const formattedDay = formattedDate.replace(/^0/, ' ');

    return formattedDay;
  }
}

export function transformErrorMessage(errorMessage) {
  // Find the last occurrence of "/"
  const lastIndex = errorMessage.lastIndexOf('/');

  if (lastIndex !== -1) {
    // Extract the substring after the last "/"
    let transformedString = errorMessage.substring(lastIndex + 1);

    // Capitalize the first letter of the transformed string
    transformedString = transformedString.charAt(0).toUpperCase() + transformedString.slice(1);

    // Remove hyphens from the transformed string
    transformedString = transformedString.replace(/-/g, ' ');

    return transformedString;
  } else {
    return errorMessage; // No "/" found, return the original string
  }
}

export function checkType(o, method) {
  if (method === 1) {
    if (o.list_type === "seen") {
      return true
    }
    return false;
  } else {
    if (o.list_type === "watchlist") {
      return true
    }
    return false;
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

