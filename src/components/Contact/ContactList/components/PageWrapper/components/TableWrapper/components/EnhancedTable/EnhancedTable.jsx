import React, { Component } from "react";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import Theme from "../../../../../../../../Style/Theme/TableTheme";
import MaterialTable from "material-table";
import SelectModal from "./components/SelectModal";
import tableIcons from "../../../../../../../../../lib/tableLibs/getIcons";
import getColumns from "../../../../../../../../../lib/tableLibs/getColumns";
import exportCSV from "../../../../../../../../../lib/tableLibs/exportCSV";
import exportPDF from "../../../../../../../../../lib/tableLibs/exportPDF";
import updateRow from "../../../../../../../../../lib/tableLibs/updateRow";
import {
  GetAllContacts,
  removeContact,
} from "../../../../../../../../Api/Contact";
import {
  getTable,
  processData,
  remove,
  editColumns,
  updateTable,
} from "../../../../../../../../../lib/tableLibs/dataOperation";

class EnhancedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      columns: getColumns(),
      selectedRow: null,
      dataToShow: [],
      allData: [],
    };
  }

  componentDidMount() {
    GetAllContacts().then((data) => {
      console.log("EnhancedTable -> componentDidMount -> data", data);
      let allData = [];
      allData = data.map((cur) => processData(cur));
      const showData = getTable(
        allData,
        this.props.tab,
        this.props.userAccount
      );
      this.setState({
        allData: allData,
        dataToShow: showData,
      });
    });
  }

  removeRow = (evt, selectedRow) => {
    evt.preventDefault();
    new Promise((resolve, reject) => {
      setTimeout(() => {
        let allData = [...this.state.dataToShow],
          deleteRow = [];
        // remove rows of dataToShow for table display
        allData = remove(allData, selectedRow);
        for (const row of selectedRow) {
          deleteRow.push(this.state.dataToShow[row.tableData.id]);
        }
        // remove data in mongoDB
        deleteRow.map((cur) => {
          removeContact(cur.contactID).then((code) => {
            console.log("EnhancedTable -> removeRow -> code", code);
          });
        });
        this.setState({
          dataToShow: allData,
        });
        resolve();
      }, 500);
    });
  };

  addRow = (newData) =>
    new Promise((resolve, reject) => {
      newData = updateRow(newData);
      setTimeout(() => {
        // this.props.getNewTable([...this.state.data, newData]);
      }, 0);
    });

  showModal = (evt, selectedRow) => {
    evt.preventDefault();
    this.setState({ modalVisible: true });
  };

  changeVisible = (s) => {
    this.setState({ modalVisible: s });
  };

  getDataAndIndex = (data) => {
    // Add the index of rows for editing
    if (data.size !== 0) {
      data.set("index", this.state.selectedRow);
    }
    // this.props.getDataToEdit(data);
  };

  getSelectedRowIndex = (Rows) => {
    let index = [];
    for (const item of Rows) {
      index.push(item.tableData.id);
    }
    return index;
  };

  render() {
    return (
      <>
        {this.state.modalVisible && (
          <SelectModal
            changeModalVisible={this.changeVisible}
            getDataToEdit={this.getDataAndIndex}
          ></SelectModal>
        )}
        <MuiThemeProvider theme={Theme}>
          <MaterialTable
            title={null}
            columns={this.state.columns}
            data={this.state.dataToShow}
            icons={tableIcons}
            onRowClick={(evt, selectedRow) => {}}
            onSelectionChange={(Rows) => {
              this.setState({ selectedRow: this.getSelectedRowIndex(Rows) });
            }}
            actions={[
              {
                tooltip: "Remove all selected contact(s)",
                icon: tableIcons.Delete,
                onClick: this.removeRow,
              },
              {
                tooltip: "Edit contact(s)",
                icon: tableIcons.Edit,
                onClick: this.showModal,
              },
            ]}
            options={{
              selection: true,
              search: true,
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 30, 50],
              exportButton: true,
              exportCsv: exportCSV,
              exportPdf: exportPDF,
            }}
            editable={{
              onRowAdd: this.addRow,
            }}
          />
        </MuiThemeProvider>
      </>
    );
  }
}

export default EnhancedTable;
