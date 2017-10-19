import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IListItem } from '../ListItem/IListItem';
export interface IBodyState {
  detailModal: boolean;
  item: any;
  rows: IListItem[];
  columns: IColumn[];
  titleFilter: string;
}
