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
  if (url.includes('x.com')) {
    return 'x'
  }
  if (url.includes('github.com') && url.includes('issues')) {
    return 'github-issue';
  }
  return 'unknown';
};

