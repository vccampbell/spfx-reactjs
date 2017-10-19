import { IListItem } from "./IListItem";
import * as React from "react";
import styles from '../FilterableListTable.module.scss';
import { Button, DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

/*
  ListItem component handles the content for the Modal Dialog
*/
export default class ListItem extends React.Component<{ listitem: IListItem, handleUpdate: any, handleCancel: any, handleDelete: any }, { title: string }> {
  constructor(props) {
    super(props);
    //binds the event handler for the Title text field. This is needed to update the 'state' of the Title after every change
    this.handleTitleChange = this.handleTitleChange.bind(this);
    //set up the initial 'state' of the component.
    //The default value for the Title field comes from the 'props' of the parent Component.
    this.state = {
      title: this.props.listitem.Title
    };
  }
  //event handler that fires for every change of the Title input field
  //sets the state of the 'title' object to the current value of the input field.
  public handleTitleChange(newValue: any) {
    this.setState({ title: newValue });
  }
  //event handler that is called with the submit button is clicked.
  public handleEdit() {
    //create an object containing the Id of the list item, setting it to the value of the 'prop' passed in from the parent Component
    //Title is being set from the 'state'
    var item = {Id: this.props.listitem.Id, Title: this.state.title};
    //call the event handler from the parent Component. This gets 'bound' from the Component's 'props'
    this.props.handleUpdate(item);
    //close the Dialog window
    this.props.handleCancel();
  }
  //event handler that is called with the cancel button is clicked
  public handleCancel() {
    this.props.handleCancel();
  }
  public handleDelete() {
    var item = { Id: this.props.listitem.Id };
    //call the event handler from the parent Component. This gets 'bound' from the Component's 'props'
    this.props.handleDelete(item);
    //close the Dialog window
    this.props.handleCancel();
  }
  //handles the validation for the Title field, which is required.
  //Return an empty string if the field is valid,
  //otherwise return error message to display
  public handleValidationError(value: string) {
    if(value == "" || value.length === 0)
      return "Title is a required field.";
    else
      return "";
  }
  public render() {
    //variable to hold the value of the Title, which comes from the Component's 'state'
    let { title } = this.state;
    //returns the contents of the Modal Component
    //always want to bind the event handlers with .bind(this) so that 'this' doesn't get changed.
    return (
      <div className={styles.container}>
        <TextField
        label= "Title"
        required={ true }
        defaultValue={ title }
        onChanged={ this.handleTitleChange.bind(this) }
        onGetErrorMessage={ this.handleValidationError.bind(this) }
        />
        <PrimaryButton
        text="Save"
        onClick={ this.handleEdit.bind(this) }
        />
        <Button
          text="Cancel"
          onClick={ this.handleCancel.bind(this) }
        />
        <Button
          text="Delete"
          onClick={ this.handleDelete.bind(this) }
        />
      </div>
    );
  }
}
