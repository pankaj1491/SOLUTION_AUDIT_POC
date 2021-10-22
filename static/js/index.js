
const getErrosWarnings = async(Region,SolID,Version,SalesTool) => {
  let xmlContent = '';
  var Reg = Region === 'AMER' ? 'AMER': Region==='EMEA'?'EMEA' :'ASIA';
  var ST = SalesTool === 'DSA' ? 'Dsa': 'Gii';
  let tableHead = document.getElementById('auditTable');
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

    if(rawResponse.ok) {
      const xmlresponse = await rawResponse.text();
      xmlContent=xmlresponse;
      let parser = new DOMParser();
      let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
      let tags = xmlDOM.querySelectorAll('Message');
      tags.forEach(XmlNode => {

        let row = document.createElement('tr');

        //Sold+Version
        let td = document.createElement('td');
        td.innerText = SolID+'.'+Version;
        row.appendChild(td);

        //  Region-SalesTool
        td = document.createElement('td');
        td.innerText = Region+'-'+SalesTool;
        row.appendChild(td);
        
        //ProductName-OCID
        td = document.createElement('td');
        td.innerText = XmlNode.children[6].innerHTML;
        row.appendChild(td);

        //Warnings
        td = document.createElement('td');
        td.setAttribute("id", "war");
        if(XmlNode.children[8].innerHTML === 'Warning'){
          td.innerText = XmlNode.children[3].innerHTML+':-'+XmlNode.children[4].innerHTML;
          row.appendChild(td);
        }else{
          td.innerText = 'NA';
          row.appendChild(td);
        }

       //Warnings
       td = document.createElement('td');
       td.setAttribute("id", "err");
       if(XmlNode.children[8].innerHTML === 'Error'){
        td.innerText = XmlNode.children[3].innerHTML+':-'+XmlNode.children[4].innerHTML;
        row.appendChild(td);
      }else{
        td.innerText = 'NA';
        row.appendChild(td);
      }

       //Finally Add it to ParentTableHead
       tableHead.children[1].appendChild(row);
        
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



if (typeof exports !== "undefined") {
  module.exports = {
    getErrosWarnings
  };
}
