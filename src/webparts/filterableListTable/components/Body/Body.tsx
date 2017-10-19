import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { IListItem } from "../ListItem/IListItem";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import pnp, { List, ItemUpdateResult} from 'sp-pnp-js';
import ListItem from "../ListItem/ListItem";
import AllItems from "../AllItems/AllItems";
import { Dialog, DialogType } from "office-ui-fabric-react/lib/Dialog";
import styles from '../FilterableListTable.module.scss';
import { IBodyProps } from './IBodyProps';
import { IBodyState } from "./IBodyState";
/*
  Body Component is the 'main' Component for the WebPart. It receives the SPHttpClient and Site URL as 'props' from the FilterableListTable Component
  The Component's 'state' sets the whether the Modal Dialog is shown, what item is being displayed in the Modal Dialog and a list of the SharePoint items
  returned from the REST call
*/
export default class Body extends React.Component<IBodyProps, IBodyState> {
  constructor(props) {
    super(props);
    const _columns: IColumn[] = [
      {
        key: 'Id',
        name: 'ID',
        fieldName: 'Id',
        minWidth: 25,
        maxWidth: 25,
        isResizable: true,
        ariaLabel: 'Operations for ID',
        data: 'number',
        onColumnClick: this.onColumnClick
      },
      {
        key: 'Title',
        name: 'Title',
        fieldName: 'Title',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        ariaLabel: 'Operations for Title',
        data: 'string',
        onColumnClick: this.onColumnClick
      },
      {
        key: 'Created',
        name: 'Created',
        fieldName: 'Created',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        ariaLabel: 'Operations for Created',
        data: 'date',
        onColumnClick: this.onColumnClick
      },
      {
        key: 'Modified',
        name: 'Modified',
        fieldName: 'Modified',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        ariaLabel: 'Operations for Modified',
        data: 'date',
        onColumnClick: this.onColumnClick
      }
    ];
    this.state = {
      detailModal: false,
      item: null,
      columns: _columns,
      rows: [],
      titleFilter: null
    };
  }
  //Using the SPHttpClient, retrieve a list of SharePoint list items.
  //the SPHttpClient instance is coming from the Component's 'props' passed in from the FilterableListTable Component
  //along with the URL of the current site.
  private loadItems() {
    console.log('Body.loadItems');
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=Id,Title,Created,Modified`,
    SPHttpClient.configurations.v1,
      {
        headers: {
          'accept': 'application/json;odata=nometadata',
          'odata-version': '3.0'
        }
      }).then((response: SPHttpClientResponse) => {
        return response.json().then((response: any) => {
          //set new state and re-render the Component displaying the updated data from SharePoint
          this.setState({ rows: response.value});
        });
    });
  }
  @autobind
  private onColumnClick(evt: React.MouseEvent<HTMLElement>, column: IColumn) {
    const { columns, rows } = this.state;
    let newRows: IListItem[] = rows.slice();
    let newColumns: IColumn[] = columns.slice();
    let currentColumn: IColumn = newColumns.filter((currCol: IColumn, index: number) => { return column.key === currCol.key; })[0];

    newColumns.forEach((newCol: IColumn) => {
      if(newCol === currentColumn) {
        currentColumn.isSortedDescending = !currentColumn.isSortedDescending;
        currentColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    newRows = this.sortItems(newRows, currentColumn.fieldName, currentColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      rows: newRows
    });
  }
  @autobind
  private sortItems(items: IListItem[], sortBy: string, descending = false): IListItem[] {
    if (descending) {
      return items.sort((a: IListItem, b: IListItem) => {
        if (a[sortBy] < b[sortBy]) {
          return 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return -1;
        }
        return 0;
      });
    } else {
      return items.sort((a: IListItem, b: IListItem) => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }
        return 0;
      });
    }
  }
  //Event handler that will open the Modal Dialog and set the item 'state' to the current list item.
  public passItemToModal(item) {
    this.setState({
      detailModal: true,
      item: item
    });
  }
  //Opens the Modal Dialog
  public openDetailModal() {
    this.setState({
      detailModal: true
    });
  }
  //Closes the Modal Dialog by setting the state of detailModal to false
  public closeDetailModal() {
    this.setState({
      detailModal: false
    });
  }
  //Event handler that executes the POST REST call to the SharePoint list to update the List item, specifically just the Title is updated.
  public onUpdate(item: any) {
    /*
      Example using PNP to update the list item
    */
    pnp.sp.web.lists.getByTitle(`${this.props.listName}`).items.getById(item.Id).update({
      Title: item.Title
    }, "*").then((iur: ItemUpdateResult) => {
      console.log('ItemUpdateResult', iur);
      this.loadItems();
    });
    /*
      Example of using SPHttpClient to update a list item.
    */
    // const body = JSON.stringify({
    //   '__metadata': {
    //     'type': 'SP.Data.ProjectResourcesListItem'
    //   },
    //   'Title': item.Title
    // });
    // this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`, SPHttpClient.configurations.v1,
    //   {
    //     headers: {
    //       'accept': 'application/json;odata=nometadata',
    //       'odata-version': '3.0',
    //       'IF-MATCH': '*',
    //       'X-HTTP-Method': 'MERGE'
    //     },
    //     body: body
    //   }).then((response: SPHttpClientResponse): void => {
    //     //after the REST call is successful, reload the entire list... not the most efficient way, but it demonstrates how the
    //     //UI is updated with the new data since loadItems sets the 'state' of the 'rows' object.
    //     this.loadItems();
    //   });
  }
  public onDelete(item: any) {
    pnp.sp.web.lists.getByTitle(`${this.props.listName}`).items.getById(item.Id).delete("*").then(() => {
      this.loadItems();
    });
  }
  public onFilter(text:string) {
    this.setState({
      titleFilter: text
    });
  }
  //Renders the contents to the Modal Dialog
  public renderContents(item) {
    console.log('Body.renderContents item', item);
    return (<ListItem listitem={item} handleUpdate={this.onUpdate.bind(this)} handleCancel={this.closeDetailModal.bind(this)} handleDelete={this.onDelete.bind(this)} />);
  }
  //Renders the AllItems Component and a single instance of the Modal Component
  public render() {
    //return a list of filtered items if a filter is being applied.
    let filteredItems: IListItem[];
    if(this.state.titleFilter) {
      filteredItems = this.state.rows.filter(i => i.Title.toLowerCase().indexOf(this.state.titleFilter) > -1);
    } else {
      filteredItems = this.state.rows;
    }
  return (
    <div>
      <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
          <a href="#" className={`${styles.button} ${this.props.disabled}`} onClick={() => this.loadItems()}>
            <span className={styles.label}>Read all items</span>
          </a>
        </div>
      </div>
      <AllItems
        spHttpClient={this.props.spHttpClient}
        siteUrl={this.props.siteUrl}
        passItemToModal={this.passItemToModal.bind(this)}
        filterItems={this.onFilter.bind(this)}
        items={filteredItems}
        columns={this.state.columns} />
      <Dialog
        hidden={ !this.state.detailModal }
        onDismiss={ this.closeDetailModal.bind(this) }
        dialogContentProps = { {
          type: DialogType.normal,
          title: 'Edit List Item',
          subText: 'Modify Item Title and click Save'
        } }
      >
        { this.state.item ? this.renderContents(this.state.item) : null }
      </Dialog>
    </div>);
  }
}
