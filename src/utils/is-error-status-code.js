export function isErrorStatusCode(statusCode) {
  return String(statusCode).startsWith('4') || String(statusCode).startsWith('5');
}
