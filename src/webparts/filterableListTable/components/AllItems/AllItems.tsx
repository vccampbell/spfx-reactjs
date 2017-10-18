import { SPHttpClient } from "@microsoft/sp-http";
import { IListItem } from "../ListItem/IListItem";
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from "react";
import { IAllItemsProps } from "./IAllItemsProps";
import { IAllItemsState } from "./IAllItemsState";

/*
  AllItems Component takes in a list of SharePoint items from the Component's 'props'
*/
export default class AllItems extends React.Component<IAllItemsProps, IAllItemsState> {
  private _selection: Selection = undefined;

  constructor(props) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this.getSelectionDetails()})
    });

    console.log('AllItems.constructor this.props.items', this.props.items);
    this.state = {
      selectionDetails: this.getSelectionDetails()
    };
  }

  private getSelectionDetails(): string {
    let selectionCount: number = this._selection.getSelectedCount();

    switch(selectionCount) {
      case 0:
      return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).Title;
      default:
        return `${selectionCount} items selected`;
    }
  }

  @autobind
  private onChanged(text: any): void {
    this.props.filterItems(text);
  }
  @autobind
  private onItemInvoked(item: any): void {
    this.props.passItemToModal(item);
  }
  public render() {
    let { selectionDetails } = this.state;
    console.log('AllItems.render items', this.props.items.length);
    return (
      <div>
        { selectionDetails }
        <TextField
          label="Filter by Title:"
          onChanged={ this.onChanged }
        />
        <MarqueeSelection selection={ this._selection }>
          <DetailsList
            items={ this.props.items }
            columns={ this.props.columns }
            setKey="set"
            layoutMode={ DetailsListLayoutMode.fixedColumns }
            selection={ this._selection }
            selectionPreservedOnEmptyClick={ true }
            ariaLabelForSelectionColumn="Toggle Selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onItemInvoked={ this.onItemInvoked }
          />
        </MarqueeSelection>
      </div>
    );
  }
}
