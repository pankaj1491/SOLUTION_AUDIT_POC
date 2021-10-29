UIC.loadURLSVGs([
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__search.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__import-alt.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__handle.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__chevron-right.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__chevron-left.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__loading-sqrs.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__chevron-right.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__arrow-tri-solid-right.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__printer.svg",
  "https://uicore.dellcdn.com/1.6.0/svgs/dds__gear.svg"
], false);
var solarr = []; // Global Variable to store the API inputs
var i = 0; // to automatically increment the ID no for cloned element
// function to clone
function repeat(event) {
  event.stopPropagation();
  var original = event.target.parentElement.parentElement;
  var originalc = document.getElementById('inputContainer');
  var c = originalc.childElementCount;
  var elements = original.childNodes;
  var inputTypes = ['input', 'select'];
  var subarr = [];
  for (var j = 0; j < elements.length; j++) {
    var elm = elements[j];
    if (inputTypes.indexOf(`${elm.tagName}`) && typeof elm.type !== 'undefined') {
      subarr.push(elm.value);

    }
  }
  solarr.push(subarr);
  var clone = original.cloneNode(true);
  clone.id = "repeatTHIS" + ++i;
  clone.children[3].value = "";
  originalc.insertBefore(clone, originalc.children[c - 2]);
  console.log(solarr)
}
// Initialising the Complex Table with Empty Rows
var mock = {
  tableRow: function (howMany) {
    if (howMany == null) howMany = 1;
    var dataArray = [];
    for (var intI = 0; intI < howMany; intI++) {
      dataArray.push({
        data: ["", "", "", "", ""]
      });
    }
    return dataArray;
  }
};
var newdataArray = mock.tableRow(40);
console.log(newdataArray);
var options = {
  search: true,
  columns: true,
  settings: true,
  print: false,
  import: false,
  sort: true,
  condensed: true,
  header: true,
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
      "Product/OC",
      "Warnings",
      "Errors"
    ],
    columns: [
      { select: 0, sort: "asc", fixed: false },
      { select: 1, sort: "asc", fixed: false },
      { select: 2, fixed: false },
      { select: 3, fixed: false },
      { select: 4, fixed: false }
    ],
    rows: []
  }
};
var exampleTable = document.getElementById("exampleTable");
var exampleTableInstance = new UIC.Table(exampleTable, {
  ...options,
  data: { ...options.data, rows: newdataArray },
});



//API call done by button handler function
// const getErrosWarnings = async () => {
//   var promisesArray = [];
//   var ndataArray = [];
//   solarr.forEach( async(data) => {

//     let xmlContent = '';
//     var Reg = data[0];
//     var ST = data[2];
//     var solver = data[1];
//     var solverarr = solver.split(".");
//     var SolID = solverarr[0];
//     var Version = solverarr[1];
//     const raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:v1=\"http://eDell.dell.com/scm/contracts/v1\" xmlns:v11=\"http://eDell.dell.com/scm/schema/v1\">\r\n<soapenv:Header/>\r\n<soapenv:Body>\r\n<v1:ValidateSolution>\r\n<v1:request>\r\n<v11:Region>${Reg}</v11:Region>\r\n<v11:RequestOrigin>${ST}</v11:RequestOrigin>\r\n<v11:IncludeXPODValidationMessages>false</v11:IncludeXPODValidationMessages>\r\n<v11:SolutionId>${SolID}</v11:SolutionId>\r\n<v11:Version>${Version}</v11:Version>\r\n</v1:request>\r\n</v1:ValidateSolution>\r\n</soapenv:Body>\r\n</soapenv:Envelope>`;
//     try {
//       const rawResponse = await fetch("https://scso-g4.solutions-np.mesh.dell.com/V1/SolutionService", {
//         method: 'POST',
//         body: raw,
//         headers: {
//           "Content-Type": "text/xml",
//           "SOAPAction": "http://eDell.dell.com/scm/contracts/v1/ISolutionService/ValidateSolution"
//         },
//         redirect: 'follow'
//       });
//  promisesArray.push(rawResponse);
//       if (rawResponse.ok) {
//         const xmlresponse = await rawResponse.text();
//         xmlContent = xmlresponse;
//         let parser = new DOMParser();
//         let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
//         let tags = xmlDOM.querySelectorAll('Message');
//         let td1, td2, td3, td4, td5;
//         tags.forEach(XmlNode => {

//           td1 = SolID + '.' + Version;

//           td2 = Reg + '-' + ST;

//           td3 = XmlNode.children[6].innerHTML;

//           if (XmlNode.children[8].innerHTML === 'Warning') {
//             td4 = XmlNode.children[3].innerHTML + ':-' + XmlNode.children[4].innerHTML;

//           } else {
//             td4 = 'NA';
//           }

//           if (XmlNode.children[8].innerHTML === 'Error') {
//             td5 = XmlNode.children[3].innerHTML + ':-' + XmlNode.children[4].innerHTML;
//           } else {
//             td5 = 'NA';
//           }

//           ndataArray.push({
//             data: [td1, td2, td3, `<span class='war'>${td4}</span>`, `<span class='err'>${td5}</span>`]
//           });

//         });




//       } else {
//         const error = new Error();
//         error.message = 'Something went wrong.';
//         throw error;
//       }

//     } catch (e) {
//       alert(`Error: ${e.message}`);
//     }

//   })
//   await Promise.all(promisesArray);
//   console.log("hahaha",ndataArray);
//   return ndataArray;

// }


// The Audit Button Handler function, Issue is here Probably?

const getErrosWarnings = async () => {
  var promisesArray = [];
  var xmlpromisesArray= [];
  var Reg,ST,SolID,Version;
  let xmlContent='';
  solarr.forEach((data) => {
     Reg = data[0];
     ST = data[2];
    var solver = data[1];
    var solverarr = solver.split(".");
     SolID = solverarr[0];
     Version = solverarr[1];
    const raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:v1=\"http://eDell.dell.com/scm/contracts/v1\" xmlns:v11=\"http://eDell.dell.com/scm/schema/v1\">\r\n<soapenv:Header/>\r\n<soapenv:Body>\r\n<v1:ValidateSolution>\r\n<v1:request>\r\n<v11:Region>${Reg}</v11:Region>\r\n<v11:RequestOrigin>${ST}</v11:RequestOrigin>\r\n<v11:IncludeXPODValidationMessages>false</v11:IncludeXPODValidationMessages>\r\n<v11:SolutionId>${SolID}</v11:SolutionId>\r\n<v11:Version>${Version}</v11:Version>\r\n</v1:request>\r\n</v1:ValidateSolution>\r\n</soapenv:Body>\r\n</soapenv:Envelope>`;
    try {
      const apiPromise = fetch("https://scso-g4.solutions-np.mesh.dell.com/V1/SolutionService", {
                method: 'POST',
                body: raw,
                headers: {
                  "Content-Type": "text/xml",
                  "SOAPAction": "http://eDell.dell.com/scm/contracts/v1/ISolutionService/ValidateSolution"
                },
                redirect: 'follow'
              });
      promisesArray.push(apiPromise);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  });
  let responses = await Promise.all(promisesArray);
  console.log("Only console after all promises", responses);
  var ndataArray = [];
  responses.forEach((rawResponse) => {
    if(rawResponse.ok){
        const xmlpromise = rawResponse.text();
        xmlpromisesArray.push(xmlpromise);
       
    }
    else {
        const error = new Error();
        error.message = 'Something went wrong.';
        throw error;
    }
  });
  let xmlresponses = await Promise.all(xmlpromisesArray);
  console.log(xmlresponses);
  var j=0;
  xmlresponses.forEach((xmlresponse)=>{
    xmlContent = xmlresponse;
    let parser = new DOMParser();
    let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
    let tags = xmlDOM.querySelectorAll('Message');
    let td1, td2, td3, td4, td5;
    tags.forEach(XmlNode => {

      td1 = solarr[j][1];

      td2 = solarr[j][0] + '-' + solarr[j][2];

      td3 = XmlNode.children[6].innerHTML;

      if (XmlNode.children[8].innerHTML === 'Warning') {
        td4 = XmlNode.children[3].innerHTML + ':-' + XmlNode.children[4].innerHTML;

      } else {
        td4 = 'NA';
      }

      if (XmlNode.children[8].innerHTML === 'Error') {
        td5 = XmlNode.children[3].innerHTML + ':-' + XmlNode.children[4].innerHTML;
      } else {
        td5 = 'NA';
      }

      ndataArray.push({
        data: [`<span class="SOLUTIONID" >${td1}</span>`,
        `<span class="REGSALES" >${td2}</span>`,
        `<span class="PRODUCT">${td3}</span>`,
           `<span  class='war'>${td4}</span>`,
            `<span class='err'>${td5}</span>`]
      })
      // console.log(ndataArray);
    });
     j++;
  })
  return ndataArray;
};

const auditHandler = async () => {
  var arr = await getErrosWarnings();  
  //works fine
  console.log(arr); // works fine, can see the value in console , screenshot below.
   
  var examplePagination = document.getElementById("examplePagination"); //works fine
  exampleTableInstance.deleteAll();//works fine as i see that initial tables rows are deleted

  exampleTableInstance.import({
    ...options,
    data: { ...options.data, rows: arr }
  }); // does not work fine, what could be the issue ?

  exampleTableInstance.setItems(arr.length);
  examplePagination.Pagination.page(1);

}
const deleteFile = () => {
  document.getElementById("fileinput").value="";
}
var input = document.getElementById("fileinput");
input.addEventListener('change',function(){
    readXlsxFile(input.files[input.files.length-1]).then((data)=>{
        data.shift();
        solarr = [...data];
        console.log(solarr);
        document.getElementById("uploadAuditButton").style.display="inline";
        document.getElementById("delete").style.display="inline";
    });
});