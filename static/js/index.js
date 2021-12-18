
UIC.loadURLSVGs([

  "https://uicore.dellcdn.com/1.6.0/svgs/dds__loading-sqrs.svg"
], false);

window.addEventListener('load', function (event) {
  // all resources finished loading
  document.getElementsByClassName("dds__msthd-label dds__text-truncate")[0].textContent = localStorage.getItem('Name');
});
var formsubmitmodal = new UIC.Modal(document.getElementById("Audit"),
{ backdrop: 'static' } );
var uploadsubmitmodal = new UIC.Modal(document.getElementById("uploadAudit"),
{ backdrop: 'static' } );

var solarr = []; // Global Variable to store the API inputs
var i = 0; // to automatically increment the ID no for cloned element
// function to clone
function repeat(event) {
  event.stopPropagation();
  var original = event.target.parentElement.parentElement;
  var originalc = document.getElementById('inputContainer');
  var c = originalc.childElementCount;
  var clone = original.cloneNode(true);
  clone.id = "repeatTHIS" + ++i;
  clone.children[3].value = "";
  originalc.insertBefore(clone, originalc.children[c - 2]);
}
// Initialising the Complex Table with Empty Rows
var mock = {
  tableRow: function (howMany) {
    if (howMany == null) howMany = 1;
    var dataArray = [];
    for (var intI = 0; intI < howMany; intI++) {
      dataArray.push({
        data: ["", "", "", "", "", "", ""]
      });
    }
    return dataArray;
  }
};
var newdataArray = mock.tableRow(40);
var options = {
  search: true,
  columns: true,
  settings: true,
  print: false,
  import: false,
  sort: true,
  condensed: true,
  header: true,
  defaultBatchActions: { exportCsv: true, exportJson: false, delete: false },
  perPage: 8,
  perPageSelect: [8, 16, 32, 64],
  rearrangeableColumns: true,
  layout: {
    row1: "{placeholder:2:end}{settings:1:end}",
    row2: "{actions:1:start}{search:1:start}{placeholder:1}"
  },
  data: {
    headings: [
      "SolutionID",
      "Sales/Region",
      "SolName",
      "Order Code",
      "Warnings",
      "Errors",
      "Rule Name"
    ],
    columns: [
      { select: 0, sort: "asc", fixed: false },
      { select: 1, sort: "asc", fixed: false },
      { select: 2, sort: "asc", fixed: false },
      { select: 3, sort: "asc", fixed: false },
      { select: 4, sort: "asc", fixed: false },
      { select: 5, sort: "asc", fixed: false },
      { select: 6, sort: "asc", fixed: false }
    ],
    rows: []
  }
};
var exampleTable = document.getElementById("exampleTable");
var exampleTableInstance = new UIC.Table(exampleTable, {
  ...options,
  data: { ...options.data, rows: newdataArray },
});



// The Audit Button Handler function, Issue is here Probably?

const getErrosWarnings = async () => {
  var promisesArray = [];
  var xmlpromisesArray = [];
  var Reg, ST, SolID, Version, env, url;
  let xmlContent = '';
  solarr.forEach((data) => {
    Reg = data[0];
    ST = data[2];
    env = data[3];
    var solver = data[1];
    var solverarr = solver.split(".");
    SolID = solverarr[0];
    Version = solverarr[1];
    if (env === 'G4') {
      url = "https://scso-g4.solutions-np.mesh.dell.com/V1/SolutionService"
    }
    else {
      url = "https://scso.solutions.mesh.dell.com/V1/SolutionService"
    }
    const raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:v1=\"http://eDell.dell.com/scm/contracts/v1\" xmlns:v11=\"http://eDell.dell.com/scm/schema/v1\">\r\n<soapenv:Header/>\r\n<soapenv:Body>\r\n<v1:ValidateSolution>\r\n<v1:request>\r\n<v11:Region>${Reg}</v11:Region>\r\n<v11:RequestOrigin>${ST}</v11:RequestOrigin>\r\n<v11:IncludeXPODValidationMessages>false</v11:IncludeXPODValidationMessages>\r\n<v11:SolutionId>${SolID}</v11:SolutionId>\r\n<v11:Version>${Version}</v11:Version>\r\n</v1:request>\r\n</v1:ValidateSolution>\r\n</soapenv:Body>\r\n</soapenv:Envelope>`;
  
    try {
      const apiPromise = fetch(url, {
        method: 'POST',
        body: raw,
        headers: {
          "Content-Type": "text/xml",
          "SOAPAction": "http://eDell.dell.com/scm/contracts/v1/ISolutionService/ValidateSolution"
        },
        redirect: 'follow'
      });
        promisesArray.push(apiPromise);
        apiPromise.then(
          function(value) { return null },
          function(e) { alert(`Seems to be CORS issue, for Production please use Chrome in Disabled Security Mode:- ${e.message}`); formsubmitmodal.hide(); }
        );
     
    } catch (e) {
      alert(`Something went wrong in API call: ${e.message}`);
    }
  });
  
  let responses = await Promise.all(promisesArray);
  var ndataArray = [];
  responses.forEach((rawResponse) => {
    if (rawResponse.ok) {
      const xmlpromise = rawResponse.text();
      xmlpromisesArray.push(xmlpromise);

    }
    else {
      const error = new Error();
      error.message = 'Something went wrong.';
      alert(error);
    }
  });
  let xmlresponses = await Promise.all(xmlpromisesArray);
  var j = 0;
  xmlresponses.forEach((xmlresponse) => {
    xmlContent = xmlresponse;
    let parser = new DOMParser();
    let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
    let tags = xmlDOM.querySelectorAll('Message');
    let td1, td2, td3, td4, td5, td6, td7;
    tags.forEach(XmlNode => {

      td1 = solarr[j][1];

      td2 = solarr[j][0] + '-' + solarr[j][2];

      var SOLOC = XmlNode.children[6].innerHTML;
      var ind = SOLOC.indexOf('[');
      if (ind >= 0) {
        td3 = SOLOC.substring(0, ind - 3);
      } else {
        td3 = SOLOC;
      }
      if (ind >= 0) {
        td4 = SOLOC.substring(ind + 1, SOLOC.length - 1);
      } else {
        td4 = 'NA'
      }
      if (XmlNode.children[8].innerHTML === 'Warning') {
        td5 = XmlNode.children[3].innerHTML;

      } else {
        td5 = 'NA';
      }

      if (XmlNode.children[8].innerHTML === 'Error') {
        td6 = XmlNode.children[3].innerHTML;
      } else {
        td6 = 'NA';
      }


      td7 = XmlNode.children[4].innerHTML;



      ndataArray.push({
        data: [`<span class="SOLUTIONID" >${td1}</span>`,
        `<span class="REGSALES" >${td2}</span>`,
        `<span class="SOL">${td3}</span>`,
        `<span  class='OC'>${td4}</span>`,
        `<span class='war'>${td5}</span>`,
        `<span class='err'>${td6}</span>`,
        `<span class='RULE'>${td7}</span>`]
      })
    });
    j++;
  })
  formsubmitmodal.hide();
  uploadsubmitmodal.hide();
  return ndataArray;
 
};

const auditHandler = async () => {
  if (solarr.length === 0) {
    alert("Please check if you have uploaded the file or file is not empty.");
  }
  uploadsubmitmodal.show();
  var arr = await getErrosWarnings();

  var examplePagination = document.getElementById("examplePagination"); //works fine
  exampleTableInstance.deleteAll();//works fine as i see that initial tables rows are deleted
  exampleTableInstance.import({
    ...options,
    data: { ...options.data, rows: arr }
  }); // does not work fine, what could be the issue ?

  exampleTableInstance.setItems(arr.length);
  examplePagination.Pagination.page(1);

}
const formauditHandler = async (event) => {
  event.preventDefault();
  solarr=[];

  var original = event.target.parentElement.parentElement.parentElement.parentElement;
  var elements = original.childNodes;
  var inputTypes = ['input', 'select'];

  for (var k = 0; k < elements.length; k++) {

    var el = elements[k];
    if (typeof el.id !== 'undefined') {
      if (el.id.includes('repeatTHIS')) {
        var subarr = [];
        var childelm = elements[k].childNodes;
        for (var j = 0; j < childelm.length; j++) {
          var elm = childelm[j];
          if (inputTypes.indexOf(`${elm.tagName}`) && typeof elm.type !== 'undefined') {
            subarr.push(elm.value);

          }

        }
        solarr.push(subarr);
      }

    }
  }

  solarr.forEach((arr1, index) => {

    if (arr1[1] === "") {
      solarr.splice(index, 1);
    }

  })

  if (solarr.length === 0) {
    alert("Please check if you have provided valid inputs.");
  }
  else if (solarr.length >= 1 && solarr[0][1] === '') {
    alert("Please check if you have provided valid inputs.");
  }
  else {
    formsubmitmodal.show();
    var arr = await getErrosWarnings();

    var examplePagination = document.getElementById("examplePagination"); //works fine
    exampleTableInstance.deleteAll();//works fine as i see that initial tables rows are deleted
  
    exampleTableInstance.import({
      ...options,
      data: { ...options.data, rows: arr }
    }); // does not work fine, what could be the issue ?

    exampleTableInstance.setItems(arr.length);
    examplePagination.Pagination.page(1);
  }
}
const deleteFile = () => {
  document.getElementById("fileinput").value = "";
}
var input = document.getElementById("fileinput");
input.addEventListener('change', function () {
  readXlsxFile(input.files[input.files.length - 1]).then((data) => {
    solarr.length = 0;
    data.shift();
    var newarr = [];
    data.forEach((arr) => {
      var newdata = arr.join().split(',');
      newarr.push(newdata);
    })
    solarr = [...newarr];
    document.getElementById("uploadAuditButton").style.display = "inline";
    document.getElementById("delete").style.display = "inline";
  });
});