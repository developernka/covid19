$('#main').hide();
$('#loading').show();
$.get(
  'https://spreadsheets.google.com/feeds/list/1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk/od6/public/values?alt=json',
  function(json) {
    console.log(json.feed.entry.length);
    var tbodyHtm = '';
    $(json.feed.entry).each(function(r, row) {
      if (row['gsx$currentstatus']['$t'].trim() != '')
        var trHtm = `<tr id="${row['gsx$patientnumber']['$t']}">`;
      trHtm += `<td>${row['gsx$dateannounced']['$t']}</td>`;
      trHtm += `<td>${row['gsx$currentstatus']['$t'] +
        (row['gsx$dateannounced']['$t'] != row['gsx$statuschangedate']['$t']
          ? ' on ' + row['gsx$statuschangedate']['$t']
          : '')}</td>`;
      trHtm += `<td>${row['gsx$detectedstate']['$t']}</td>`;
      trHtm += `<td>${
        row['gsx$detecteddistrict']['$t'] == row['gsx$detectedcity']['$t']
          ? row['gsx$detecteddistrict']['$t']
          : (
              row['gsx$detecteddistrict']['$t'] +
              ' ' +
              row['gsx$detecteddistrict']['$t']
            ).trim()
      }</td>`;
      trHtm += `<td>${(
        row['gsx$gender']['$t'] +
        ' ' +
        row['gsx$agebracket']['$t']
      ).trim()}</td>`;
      trHtm += `<td>${row['gsx$notes']['$t']}</td>`;
      trHtm += `<td>${
        (row['gsx$nationality']['$t'] + '').toLowerCase().indexOf('india') == -1
          ? row['gsx$nationality']['$t']
          : ''
      }</td>`;
      trHtm += `<td><a href="${row['gsx$source1']['$t']}">View</a> <a href="${row['gsx$source2']['$t']}">View</a> <a href="${row['gsx$source3']['$t']}">View</a></td>`;
      trHtm += `</tr>`;
      tbodyHtm = trHtm + tbodyHtm;
    });
    $('#main>tbody').html(tbodyHtm);
    $('#loading').hide();
    $('#main').show();
  }
);
