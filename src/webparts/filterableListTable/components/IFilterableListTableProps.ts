import { IColumnProps } from './IColumnProps';
import { SPHttpClient } from '@microsoft/sp-http';
export interface IFilterableListTableProps {
  description: string;
  listName: string;
  columns: IColumnProps[];
  rows: string[];
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
