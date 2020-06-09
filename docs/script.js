var db = new Dexie("covid19_database");
db.version(1).stores({
  patient: 'entryid,patientnumber,statecode,detectedstate,detecteddistrict,[statecode+detecteddistrict+dateannounced]',
  state: 'statecode'
});

function getLatest(n) {
  $.get('https://api.covid19india.org/raw_data' + n + '.json', function (resp) {
    resp.raw_data.map(row => {
      row.dateannounced = row.dateannounced.split('/').reverse().join("-");
      return row;
    });
    db.patient.bulkPut(resp.raw_data, console.log);
    try {
      let lastDate = resp.raw_data[resp.raw_data.length - 1].dateannounced.split('/').reverse().join('/');
      if (new Date(lastDate).getTime() < new Date().getTime() - 1 * 24 * 3600 * 1000) {
        localStorage.latestDb = n + 1;
        getLatest(n + 1);
      }
    } catch (e) {
      console.log(e);
    }
  });
}
let latestDb = 1 || parseInt(localStorage.latestDb);
getLatest(latestDb);

function getStateDistrict() {
  $.get('https://api.covid19india.org/v2/state_district_wise.json', function (resp) {
    db.state.bulkPut(resp, console.log);
  });
}
getStateDistrict();

showSearchBar();
function showSearchBar() {
  db.state.toArray().then(states => {
    let htm = "<option value=''>Select State</option>";
    states.forEach(state => {
      htm += `<option value="${state.statecode}">${state.state}</option>`;
    });
    $("#state").html(htm);
    $("#state").change(function () {
      localStorage.state = $("#state").val();
      db.state.get($(this).val()).then(state => {
        let htm = "<option value=''>Select District</option>";
        state.districtData.forEach(district => {
          htm += `<option value="${district.district}">${district.district}</option>`;
        });
        $("#district").html(htm);
        $("#district").change(function () {
          localStorage.district = $("#district").val();
          showTable({
            statecode: $("#state").val(),
            detecteddistrict: $("#district").val()
          });
        });
        $("#district").val(localStorage.district);
        $("#district").trigger('change');
      });
    });
    $("#state").val(localStorage.state);
    $("#state").trigger('change');

    $("#dateannounced").change(function () {
      if ($("#dateannounced").val() === "") {
        showTable({
          statecode: $("#state").val(),
          detecteddistrict: $("#district").val()
        });
      } else {
        showTable({
          statecode: $("#state").val(),
          detecteddistrict: $("#district").val(),
          dateannounced: $("#dateannounced").val()
        });
      }
    })
  });
}

function showTable(query) {
  console.time('showTable');
  db.patient.where(query).reverse().sortBy('dateannounced').then(rows => {
    console.log(rows);
    let htm = "";
    rows.forEach(row => {
      htm += `<tr title='${JSON.stringify(row, null, 4)}' ><td>${row.dateannounced}</td><td>${row.detectedcity}</td><td>${row.numcases == 1 ? row.gender + " " + row.agebracket : `<span class='text-${row.numcases > 0 ? 'danger' : 'success'}'>` + row.numcases + '</span>'}</td></tr>`;
      console.log('row');
    });
    $("#main tbody").html(htm);
    console.timeEnd('showTable');
  });
}

//showTable({ statecode: localStorage.state, detecteddistrict: localStorage.district });
