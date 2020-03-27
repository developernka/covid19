$('#main').hide();
$('#loading').show();
$.get(
  'https://spreadsheets.google.com/feeds/list/1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk/od6/public/values?alt=json',
  function(json) {
    console.log(json.feed.entry.length);
    var tbodyHtm = '';
    $(json.feed.entry).each(function(r, row) {
      if (row['gsx$dateannounced'])
        var trHtm = `<tr id="${row['gsx$patientnumber']}">`;
      trHtm += `<td>${row['gsx$dateannounced']}</td>`;
      trHtm += `<td>${row['gsx$currentstatus'] +
        (row['gsx$dateannounced'] != row['gsx$statuschangedate']
          ? ' on ' + row['gsx$statuschangedate']
          : '')}</td>`;
      trHtm += `<td>${row['gsx$detectedstate']}</td>`;
      trHtm += `<td>${
        row['gsx$detecteddistrict'] == row['gsx$detectedcity']
          ? row['gsx$detecteddistrict']
          : (
              row['gsx$detecteddistrict'] +
              ' ' +
              row['gsx$detecteddistrict']
            ).trim()
      }</td>`;
      trHtm += `<td>${(
        row['gsx$gender'] +
        ' ' +
        row['gsx$agebracket']
      ).trim()}</td>`;
      trHtm += `<td>${row['gsx$note']}</td>`;
      trHtm += `<td>${
        row['gsx$nationality'].toLowerCase().indexOf('india') == -1
          ? row['gsx$nationality']
          : ''
      }</td>`;
      trHtm += `<td><a href="${row['gsx$source1']}">View</a> <a href="${row['gsx$source2']}">View</a> <a href="${row['gsx$source3']}">View</a></td>`;
      trHtm += `</tr>`;
      tbodyHtm += trHtm;
    });
    $('#main>tbody').html(tbodyHtm);
    $('#loading').hide();
    $('#main').show();
  }
);
