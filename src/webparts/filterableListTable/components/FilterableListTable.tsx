import * as React from 'react';
import styles from './FilterableListTable.module.scss';
import { IFilterableListTableProps } from './IFilterableListTableProps';
import { IConfigState } from './IConfigState';
import { Button, DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import Body from './Body/Body';
/*
  Default Component
*/
export default class FilterableListTable extends React.Component<IFilterableListTableProps, IConfigState> {
  private listItemEntityTypeName: string = undefined;
  constructor(props: IFilterableListTableProps, state: IConfigState) {
    super(props);
    this.state = {
      status: this.listNotConfigured(this.props) ? "Please configure list in Web Part Properties" : "Ready"
    };
  }
  public componentWillReceiveProps(nextProps: IFilterableListTableProps): void {
    console.log('FilterableListTable.componentWillReceiveProps');
    this.listItemEntityTypeName = undefined;
    this.state = {
      status: this.listNotConfigured(this.props) ? "Please configure list in Web Part Properties" : "Ready"
    };
  }
  public render(): React.ReactElement<IFilterableListTableProps> {
    console.log('FilterableListTable.render()');
    const disabled: string = this.listNotConfigured(this.props) ? styles.disabled : '';
    return (
      <div className={styles.filterableListTable}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <span className='ms-font-xl ms-fontColor-white'>
                Sample SharePoint CRUD operations in React
              </span>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">{this.state.status}</div>
          </div>
          <Body spHttpClient={this.props.spHttpClient} siteUrl={this.props.siteUrl} listName={this.props.listName} disabled={disabled} />
        </div>
      </div>
    );
  }
  private listNotConfigured(props: IFilterableListTableProps) {
    return props.listName === undefined || props.listName === '' || props.listName.length === 0;
  }
}
