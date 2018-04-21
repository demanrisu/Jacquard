import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

// import ListEditButton from '../../general/components/ListEditButton';
// import ListDeleteButton from '../../general/components/ListDeleteButton';
import FieldListTable from '../components/FieldListTable';

// Assumes that you are going to have a list of some sort that you can edit.
// Takes a list of fields that you want to show, a form that will act as the add/edit form and
// the name of the array from currentProject that you want to deal with

class ListPage extends React.Component {
	constructor(props) {
		super(props);

		// Initialize the state of the component
		this.state = {
			// The Add/Edit form is initially closed
			addEditFormOpen: false,
			// Whether the Add/Edit form is in Add mode (it's in Edit mode otherwise)
			addEditFormAddModeEnabled: true,
			// We don't have any form data yet
			addEditFormData: null,
			// The previous value of the key before the form data was updated
			// (initially null)
			addEditFormDataPreviousKeyValue: null,
		};
	}

	onAddItemClick = () => {
		// Create new Add/Edit form data
		const newFormData = this.createNewAddEditFormData();

		// Open the form in Add mode
		this.openAddForm(newFormData);
	};

	onEditItemClick = (keyValue) => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be editing
		const rowData = currentProject[this.props.currentProjectPropName];

		// Generate the form data from the row data
		const addEditFormData = {};
		rowData.forEach((row) => {
			if (row[this.props.keyName] === keyValue) {
				this.setFieldsBasedOnFormSchema(row, addEditFormData);
			}
		});

		// Open the form in Edit mode
		this.openEditForm(addEditFormData);
	};

	onDeleteItemClick = (keyValue) => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be deleting from
		const rowData = currentProject[this.props.currentProjectPropName];

		// Delete the item
		const filteredRowData = rowData.filter(row => row[this.props.keyName] !== keyValue);

		// Update the current project with the new row data
		currentProject[this.props.currentProjectPropName] = filteredRowData;

		// Notify the callback that the current project has changed
		this.props.onCurrentProjectChanged(currentProject);
	};

	// TODO: Move to a helper function
	onUpdateFormField = (event, key) => {
		// Get a copy of the form data
		const addEditFormData = { ...this.state.addEditFormData };

		// Set the value of the form data based on the key
		addEditFormData[key] = event.target.value;

		// Record the updated form data in our state
		this.setState({	addEditFormData });
	}

	onAddEditFormOk = () => {
		// Get a copy of the current project
		const currentProject = { ...this.props.currentProject };

		// Get the row data we'll be updating
		const rowData = currentProject[this.props.currentProjectPropName];

		// Is Add mode enabled?
		if (this.state.addEditFormAddModeEnabled) {
			// Add the form data to the current projects row data
			rowData.push(this.state.addEditFormData);
		} else {
			// Get the index of the row we'll be updating
			// We look up the row using the previous value of the key, since it
			// might have been changed during editing
			const rowToUpdateIndex = rowData
				.findIndex(row =>
					row[this.props.keyName] === this.state.addEditFormDataPreviousKeyValue);

			// If we found the row, update it
			if (rowToUpdateIndex !== -1) {
				// Get the row to update
				const rowToUpdate = rowData[rowToUpdateIndex];

				// Update the row fields from the form data according to the form schema
				this.setFieldsBasedOnFormSchema(this.state.addEditFormData, rowToUpdate);
			}
		}

		// Notify the callback that the current project has changed
		this.props.onCurrentProjectChanged(currentProject);

		// Close the Add/Edit form
		this.closeAddEditForm();
	}

	onAddEditFormCancel = () => {
		this.closeAddEditForm();
	}

	setFieldsBasedOnFormSchema = (source, dest) => {
		this.props.formSchema.forEach((formField) => {
			dest[formField.fieldName] = source[formField.fieldName];
		});
	}

	/* eslint no-confusing-arrow: ["error", {"allowParens": true}] */
	getCurrentProjectProp = () => (
		this.props.currentProject
			? this.props.currentProject[this.props.currentProjectPropName]
			: []
	);

	openAddForm = (addEditFormData) => {
		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: true,
			addEditFormData,
			addEditFormDataPreviousKeyValue: null,
		});
	}

	openEditForm = (addEditFormData) => {
		// Get the key value from the Add/Edit form data
		// We'll use this to be able to match the row being edited even if the
		// key value changes
		const addEditFormDataPreviousKeyValue = addEditFormData[this.props.keyName];

		this.setState({
			addEditFormOpen: true,
			addEditFormAddModeEnabled: false,
			addEditFormData,
			addEditFormDataPreviousKeyValue,
		});
	}

	closeAddEditForm = () => {
		this.setState({
			addEditFormOpen: false,
		});
	}

	createNewAddEditFormData = () =>
		// Set up an empty field for each field in the form schema
		this.props.formSchema.reduce((addEditFormData, addEditFormField) => {
			addEditFormData[addEditFormField.fieldName] = '';
			return addEditFormData;
		}, {});

	render() {
		// Get the Add/Edit form component
		const AddEditForm = this.props.addEditForm;

		// Determine the title of the Add/Edit form base on whether we have
		// any form data
		const addEditFormTitle = (this.state.addEditFormAddModeEnabled)
			? this.props.editFormTitle
			: this.props.addFormTitle;

		return (
			<div>
				<Button
					onClick={this.onAddItemClick}
					variant="raised"
					color="primary"
				>
					Add
				</Button>
				<AddEditForm
					data={this.state.addEditFormData}
					open={this.state.addEditFormOpen}
					onUpdateFormField={this.onUpdateFormField}
					onOk={this.onAddEditFormOk}
					onCancel={this.onAddEditFormCancel}
					title={addEditFormTitle}
					formSchema={this.props.formSchema}
				/>
				<FieldListTable
					rows={this.getCurrentProjectProp()}
					fieldNames={this.props.fieldNames}
					displayNames={this.props.displayNames}
					keyName={this.props.keyName}
					onEditClick={this.onEditItemClick}
					onDeleteClick={this.onDeleteItemClick}
				/>
			</div>
		);
	}
}

ListPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	editFormTitle: PropTypes.string.isRequired,
	addFormTitle: PropTypes.string.isRequired,
	currentProject: PropTypes.object,
	currentProjectPropName: PropTypes.string.isRequired,
	keyName: PropTypes.string.isRequired,
	fieldNames: PropTypes.array.isRequired,
	displayNames: PropTypes.array.isRequired,
	formSchema: PropTypes.array.isRequired,
	addEditForm: PropTypes.func.isRequired,
};

ListPage.defaultProps = {
	currentProject: null,
};

export default ListPage;
