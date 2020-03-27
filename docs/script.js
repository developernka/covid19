$.get(
  'https://spreadsheets.google.com/feeds/list/1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk/od6/public/values?alt=json',
  function(json) {
    console.log(json.feed.entry.length);
  }
);
