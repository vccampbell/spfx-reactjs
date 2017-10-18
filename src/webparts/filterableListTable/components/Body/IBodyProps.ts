import { SPHttpClient } from '@microsoft/sp-http';
export interface IBodyProps {
  spHttpClient: SPHttpClient;
  siteUrl: string;
  listName: string;
  disabled: string;
}
