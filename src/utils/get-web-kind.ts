export const getWebKind = () => {
  const url = window.location.href;
  if (url.includes('v2ex.com')) {
    return 'v2ex';
  }
  if (url.includes('reddit.com')) {
    return 'reddit';
  }
  if (url.includes('news.ycombinator.com')) {
    return 'hacknews';
  }
  return 'unknown';
};

