import { ExportToCsv } from "export-to-csv";
import getDate from "./getDate";

// configure CSV generator
const Options = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: false,
  filename: "ByteCRM-contacts-" + getDate(),
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
}

const exportCSV = (columns, data, type) => {
  console.log("exportCSV -> data", data)
  if (data.length === 0) {
    alert("No contacts to export!");
    return;
  }
  const tempData = JSON.parse(JSON.stringify(data));
  const result = [];
  switch (type) {
    case "contact": {
      const transform = new Map([
        [1, "New"],
        [2, "Open"],
        [3, "In progress"],
        [4, "Open deal"],
        [5, "Unqualified"],
        [6, "Attempted to contact"],
        [7, "Connected"],
        [8, "Bad timing"],
      ]);
      for (let i = 0; i < tempData.length; i++) {
        result[i] = {};
        result[i]["name"] = tempData[i].name.props.name;
        result[i]["phone number"] = tempData[i].phoneNumber
          ? tempData[i].phoneNumber
          : "";
        result[i]["email"] = tempData[i].email ? tempData[i].email : "";
        result[i]["associated company"] = tempData[i].associatedCompany.props.name
          ? tempData[i].associatedCompany.props.name
          : "";
        result[i]["contact owner"] = tempData[i].contactOwner
          ? tempData[i].contactOwner
          : "";
        result[i]["lead status"] = tempData[i].leadStatus
          ? transform.get(tempData[i].leadStatus)
          : "";
        result[i]["last activity date"] = tempData[i].lastActivityDate
          ? tempData[i].lastActivityDate
          : "";
        result[i]["create date"] = tempData[i].createDate
          ? tempData[i].createDate
          : "";
      }
      console.log("exportCSV -> result", result);
      break;
    }
    case "company": {
      for (let i in tempData) {
        result[i] = {};
        result[i]["name"] = tempData[i].name.props.name;
        result[i]["phone number"] = tempData[i].phoneNumber ? tempData[i].phoneNumber : "";
        if (tempData[i].companyOwner) {
          let temp = "";
          for (let i = 0; i < tempData[i].companyOwner.props.length; i += 2) {
            temp += tempData[i].companyOwner.props.children[i].props.name + ", ";
            if (
              i == tempData[i].companyOwner.props.length - 2 ||
              i == tempData[i].companyOwner.props.length - 1
            ) {
              temp = temp.slice(0, temp.length - 2);
            }
          }
          result[i]["company owner"] = temp;
        } else {
          result[i]["company owner"] = "";
        }
        result[i]["last activity date"] = tempData[i].lastActivityDate
          ? tempData[i].lastActivityDate
          : "";
        result[i]["city"] = tempData[i].city ? tempData[i].city : "";
        result[i]["country"] = tempData[i].country ? tempData[i].country : "";
        result[i]["industry"] = tempData[i].industry ? tempData[i].industry : "";
        result[i]["create date"] = tempData[i].createDate;
      }
      console.log("exportCSV -> result", result);
      break;
    }
  }
  const csvExporter = new ExportToCsv(Options);
  csvExporter.generateCsv(result);
};

export default exportCSV;