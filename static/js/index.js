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

var dataArray = [];
let pe = document.getElementById("tableContainer");
let ntab = document.createElement('table');
let ntabnav = document.createElement('nav');
ntab.setAttribute("id", "initialtable");
ntab.setAttribute("data-table", "dds__table");

 ntab.setAttribute("class", "dds__table dds__table-hover dds__table-cmplx dds__table-striped");
 ntabnav.setAttribute("class","dds__pagination dds__pagination-justified-filter");
 ntabnav.setAttribute( "data-toggle","dds__pagination");
 ntabnav.setAttribute( "aria-label","pagination");
 pe.appendChild(ntab);
 pe.appendChild(ntabnav);
var mock = {
  tableRow: function(howMany) {
      if (howMany == null) howMany = 1;
      for (var intI = 0; intI < howMany; intI++) {
          dataArray.push({
              data: ["","","","",""]
          });
      }
      console.log(dataArray);
      return dataArray;
  }
};
mock.tableRow(80);
var options = {
  search: true,
  columns:true,
  settings:true,
  // showData:false,
  print:false,
  import:false,
  sort: true,
  condensed: true,
  header: true,
  fixedHeight:true,
  perPage: 10,
  perPageSelect: [10,20,24,26],
  rearrangeableColumns: true,
  layout: {
    row1: "{placeholder:2:end}{settings:1:end}",
    row2: "{actions:1:start}{placeholder:1}{search:1:end}"
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
      { select: 0, sort: "asc", fixed: true },
      { select: 1, sort: "asc", fixed: false },
      { select: 2, sort: "asc", fixed: false },
      { select: 3, sort: "asc", fixed: false },
      { select: 4, sort: "asc", fixed: false }
    ],
    rows: dataArray
  }
};
ntab.setAttribute("data-table-data",JSON.stringify(options));
[].forEach.call(document.querySelectorAll("[data-table=\"dds__table\"]"), function (element) {
  new UIC.Table(element);
});
//hit function
const getErrosWarnings = async (Region, SolID, Version, SalesTool) => {
  let xmlContent = '';
  var Reg = Region === 'AMER' ? 'AMER' : Region === 'EMEA' ? 'EMEA' : 'ASIA';
  var ST = SalesTool === 'DSA' ? 'Dsa' : 'Gii';
  const raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:v1=\"http://eDell.dell.com/scm/contracts/v1\" xmlns:v11=\"http://eDell.dell.com/scm/schema/v1\">\r\n<soapenv:Header/>\r\n<soapenv:Body>\r\n<v1:ValidateSolution>\r\n<v1:request>\r\n<v11:Region>${Reg}</v11:Region>\r\n<v11:RequestOrigin>${ST}</v11:RequestOrigin>\r\n<v11:IncludeXPODValidationMessages>false</v11:IncludeXPODValidationMessages>\r\n<v11:SolutionId>${SolID}</v11:SolutionId>\r\n<v11:Version>${Version}</v11:Version>\r\n</v1:request>\r\n</v1:ValidateSolution>\r\n</soapenv:Body>\r\n</soapenv:Envelope>`;
  try {
    const rawResponse = await fetch("https://scso-g4.solutions-np.mesh.dell.com/V1/SolutionService", {
      method: 'POST',
      body: raw,
      headers: {
        "Content-Type": "text/xml",
        "SOAPAction": "http://eDell.dell.com/scm/contracts/v1/ISolutionService/ValidateSolution"
      },
      redirect: 'follow'
    });

    if (rawResponse.ok) {
      const xmlresponse = await rawResponse.text();
      xmlContent = xmlresponse;
      let parser = new DOMParser();
      let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
      let tags = xmlDOM.querySelectorAll('Message');
      let td1, td2, td3, td4, td5;
      tags.forEach(XmlNode => {

        td1 = SolID + '.' + Version;

        td2 = Region + '-' + SalesTool;

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

        dataArray.unshift({
          data: [td1, td2, td3, td4, td5]
        });
       
      });
      // Object.assign(options.data,{rows:dataArray});
      let ce = document.getElementsByClassName("dds__table-cmplx-wrapper")[0];
      let pe = document.getElementById("tableContainer");
      ce.parentElement.removeChild(ce);
    
      let ntab = document.createElement('table');
      let ntabnav = document.createElement('nav');
      ntab.setAttribute("id", "maintable");
      ntab.setAttribute("data-table", "dds__table");
      
       ntab.setAttribute("class", "dds__table dds__table-hover dds__table-cmplx dds__table-striped");
       ntabnav.setAttribute("class","dds__pagination dds__pagination-justified-filter");
       ntabnav.setAttribute( "data-toggle","dds__pagination");
       ntabnav.setAttribute( "aria-label","pagination");
       pe.appendChild(ntab);
       pe.appendChild(ntabnav);
       const newarr = [...dataArray];
       var optionnew = {
        search: true,
        columns:true,
        settings:true,
        // showData:false,
        print:false,
        import:false,
        sort: true,
        condensed: true,
        header: true,
        fixedHeight:true,
        perPage: 10,
        perPageSelect: [10,20,24,26],
        rearrangeableColumns: true,
        layout: {
          row1: "{placeholder:2:end}{settings:1:end}",
          row2: "{actions:1:start}{placeholder:1}{search:1:end}"
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
            { select: 0, sort: "asc", fixed: true },
            { select: 1, sort: "asc", fixed: false },
            { select: 2, sort: "asc", fixed: false },
            { select: 3, sort: "asc", fixed: false },
            { select: 4, sort: "asc", fixed: false }
          ],
          rows: newarr
        }
      };
      console.log(newarr);
      ntab.setAttribute("data-table-data",JSON.stringify(optionnew));
      [].forEach.call(document.querySelectorAll("[data-table=\"dds__table\"]"), function (element) {
        new UIC.Table(element);
    
      });
    } else {
      const error = new Error();
      error.message = 'Something went wrong.';
      throw error;
    }

  } catch (e) {
    alert(`Error: ${e.message}`);
  }
}




const auditHandler = async (Region, SolID, Version, SalesTool) => {
  getErrosWarnings(Region, SolID, Version, SalesTool);

}

if (typeof exports !== "undefined") {
  module.exports = {
    getErrosWarnings,
    auditHandler
  };
}
