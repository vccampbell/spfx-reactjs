import { IColumnProps } from './components/IColumnProps';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'FilterableListTableWebPartStrings';
import FilterableListTable from './components/FilterableListTable';

import { IFilterableListTableProps } from './components/IFilterableListTableProps';

export interface IFilterableListTableWebPartProps {
  description: string;
  listName: string;
}

export default class FilterableListTableWebPart extends BaseClientSideWebPart<IFilterableListTableWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFilterableListTableProps> = React.createElement(
      FilterableListTable,
      {
        description: this.properties.description,
        listName: this.properties.listName,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        columns: [],
        rows: []
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'List Name'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
