import React, { Component, useState, forwardRef } from 'react';
import MaterialTable from 'material-table';
import { ExportToCsv } from 'export-to-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const testPhoneNum = (str) => {
  const reg = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
  return reg.test(str);
}

const testEmailAddr = (str) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(String(str).toLowerCase());
}

// for mm/dd/yyyy format
const testDate = (str) => {
  const reg = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
  return reg.test(str);
}


function getColumns() {
  return ([
    { title: 'Name', field: 'name', type: 'string', initialEditValue: '',
      validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true},
    { title: 'Email', field: 'email', type: 'string', 
      validate: (rowData) => testEmailAddr(rowData.email) ? true : { isValid: false, helperText: 'Email address format incorrect' }},
    { title: 'Phone', field: 'phoneNumber', type: 'string',
      validate: (rowData) => testPhoneNum(rowData.phoneNumber) ? true : { isValid: false, helperText: 'Phone number format incorrect' }},
    { title: 'ContactOwner', field: 'contactOwner', type: 'string', },
    { title: 'AssociatedCompany', field: 'associatedCompany', type: 'string' },
    { title: 'LastActivityDate', field: 'lastActivityDate', type: 'string', initialEditValue: getDate(),
      validate: (rowData) => {
        if (rowData.lastActivityDate === '' || testDate(rowData.lastActivityDate)) {
          return true;
        } 
        return { isValid: false, helperText: 'Date format incorrect' };}
    },
    { title: 'LeadStatus', field: 'leadStatus', type: 'string', 
      lookup: { 1: 'New', 2: 'Open', 3: 'In progress', 4: 'Open deal', 5: 'Unqualified', 6: 'Attempted to contact', 7: 'Connected', 8: 'Bad timing' },
    },
    { title: 'CreateDate', field: 'createDate', type: 'string', editable: 'never' },
  ])
};

// 配置csv生成器
const options = { 
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true, 
  showTitle: false,
  filename: 'ByteCRM-exports-contact-'+getDate(),
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: false,
  headers: ['name', 'email', 'phoneNumber', 'contactOwner', 'associatedCompany', 'lastActivity', 'leadStatus', 'createDate']
};

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

// 生成假数据的暂时方法
function createData(
  name,
  email,
  phoneNumber,
  contactOwner,
  associatedCompany,
  lastActivityDate,
  leadStatus,
  createDate
) {
  return ({
      name: name, 
      email: email, 
      phoneNumber: phoneNumber, 
      contactOwner: contactOwner,
      associatedCompany: associatedCompany,
      lastActivityDate: lastActivityDate,
      leadStatus: leadStatus,
      createDate: createDate, 
    }
  );
}

let rows = [
  createData(
    'John',
    'fqwfqwd@gmail.com',
    '0454991490',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    1,
    '08/09/2020'
  ),
  createData(
    'Louis',
    'affq@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    2,
    '08/09/2020'
  ),
  createData(
    'Eclair',
    '343ewf@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    3,
    '08/09/2020'
  ),
  createData(
    'Mary',
    '413fqw@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    4,
    '08/09/2020'
  ),
  createData(
    'Brian',
    'edgar61@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    5,
    '08/09/2020'
  ),
  createData(
    'Keith',
    'elias82@yahoo.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    6,
    '08/09/2020'
  ),
  createData(
    'Larry',
    'webb80@mail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    7,
    '08/09/2020'
  ),
  createData(
    'Jason',
    'billy73@mail.com.au',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    8,
    '08/09/2020'
  ),
  createData(
    'Joseph',
    'parlin.joseph@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    5,
    '08/09/2020'
  ),
  createData(
    'Samuel',
    'tebo84@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    3,
    '08/09/2020'
  ),
  createData(
    'Lori',
    'davis1@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    2,
    '08/09/2020'
  ),
  createData(
    'Russell',
    'lou.hull@mail.com.au',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    6,
    '08/09/2020'
  ),
  createData(
    'Debra',
    'eric31@mail.com.au',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    2,
    '08/09/2020'
  ),
  createData(
    'ricky',
    'rhodes89@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    1,
    '08/09/2020'
  ),
  createData(
    'Lanny',
    'price41@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    5,
    '08/09/2020'
  ),
  createData(
    'Peter',
    'barbara.hester.gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    5,
    '08/09/2020'
  ),
  createData(
    'Rebecca',
    'thomas93@mail.com.au',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    6,
    '08/09/2020'
  ),
  createData(
    'David',
    'david59@yahoo.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    4,
    '08/09/2020'
  ),
  createData(
    'Marc',
    'waaso.stanley@gmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    2,
    '08/09/2020'
  ),
  createData(
    'Nancy',
    'daniel.thompson@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    3,
    '08/09/2020'
  ),
  createData(
    'Jose',
    'joyce41@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    3,
    '08/09/2020'
  ),
  createData(
    'Linda',
    'timothy.west@yahoo.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    5,
    '08/09/2020'
  ),
  createData(
    'Whitney',
    'sterling18@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    7,
    '08/09/2020'
  ),
  createData(
    'Dana',
    'robert40@hotmail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    8,
    '08/09/2020'
  ),
  createData(
    'Bonnie',
    'egan54@mail.com',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    1,
    '08/09/2020'
  ),
  createData(
    'Ray',
    'mattie.lewis@mail.com.au',
    '045499149',
    'Louis',
    'HubSpot, Inc.',
    '10/09/2020',
    2,
    '08/09/2020'
  ),
];

// 表格部分样式
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff9100',
    },
  },

});

function EnhancedTable() {
  const [columns, setColumns] = useState(getColumns());
  const [data, setData] = useState(rows);
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title={null}
        columns={columns}
        data={data}
        icons={tableIcons}
        // onSelectionChange={(rows) => console.log(rows)}
        actions={[
          { tooltip: 'Remove All Selected Contacts',
            icon: DeleteIcon,
            onClick: (evt, selectedRow) => new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const names = [];
                for (const item of selectedRow) {
                  names.push(item.name);
                }
                for (let i = 0; i < dataDelete.length; ) {
                  if (names.includes(dataDelete[i].name)) {
                    dataDelete.splice(i, 1);
                    continue;
                  }
                  i++;
                }
                setData([...dataDelete]);
                resolve();
              }, 500);
            })
          }, {
            tooltip: 'Edit contact',
            icon: EditIcon,
            onClick: (event, rowData) => {
              console.log(rowData)
              // TODO1: 需要一个弹窗输入信息
            }
        }]}
        onRowClick={(evt, selectedRow) => {}}
        options={{
          selection: true,
          filtering: false,
          grouping: false,
          search: true,
          sorting: true,
          pageSize: 10,
          pageSizeOptions: [10, 30, 50],
          exportButton: true,
            exportCsv: (columns, data) => {
              let tempData = JSON.parse(JSON.stringify(data));
              const transform = new Map([
                [1, 'New'], [2, 'Open'], [3, 'In progress'], [4, 'Open deal'], [5, 'Unqualified'], [6, 'Attempted to contact'], [7, 'Connected'], [8, 'Bad timing']
              ]);
              for (let item of tempData) {
                item.leadStatus = transform.get(item.leadStatus);
                delete item.tableData;
              }
              const csvExporter = new ExportToCsv(options);
              csvExporter.generateCsv(tempData);
            },
            exportPdf: (columns, data) => {
              let tempData = JSON.parse(JSON.stringify(data));
              let dataToUse = [];
              const transform = new Map([
                [1, 'New'], [2, 'Open'], [3, 'In progress'], [4, 'Open deal'], [5, 'Unqualified'], [6, 'Attempted to contact'], [7, 'Connected'], [8, 'Bad timing']
              ]);
              for (let item of tempData) {
                item.leadStatus = transform.get(item.leadStatus);
                delete item.tableData;
              }
              for (let i in tempData) {
                dataToUse.push(Object.values(tempData[i]));
              }
              const content = {
                startY: 50,
                head: [columns.map((columnDef) => columnDef.title)],
                body: dataToUse,
              };
              const doc = new jsPDF({
                orientation: "landscape",
                size: "A4",
                unit: "pt"
              });
              doc.setFontSize(15);              
              doc.text('', 40, 40);
              doc.autoTable(content);
              doc.save(
                ('ByteCRM-exports-contact-'+getDate()) + ".pdf"
              );
            },
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              newData.createDate = getDate();
              if (newData.contactOwner === '') {
                newData.contactOwner = 'Unassigned';
              }
              setTimeout(() => {
                setData([...data, newData]);
                resolve();
              }, 500)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (newData.contactOwner === '') {
                newData.contactOwner = 'Unassigned';
              }
              setTimeout(() => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve();
              }, 500)
            }),
        }}
      />
    </MuiThemeProvider>
  )
}


export default EnhancedTable;