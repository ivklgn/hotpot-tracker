export function getOperatingSystem() {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf('Win') !== -1) {
    return 'Windows';
  } else if (userAgent.indexOf('Mac') !== -1) {
    return 'MacOS';
  } else if (userAgent.indexOf('X11') !== -1 || userAgent.indexOf('Linux') !== -1) {
    return 'Linux';
  } else if (userAgent.indexOf('Android') !== -1) {
    return 'Android';
  } else if (userAgent.indexOf('like Mac') !== -1) {
    return 'iOS';
  } else {
    return 'Unknown OS';
  }
}
