import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import themes from '../themes';

import ListPage from '../../general/pages/ListPage';
import FieldListForm from '../../general/components/FieldListForm';
import fieldListItemContent from '../../general/utils/field-list-item-content';

class CharacterPage extends React.Component {
	render() {
		// The list fields
		const fields = [
			{
				name: 'name',
				displayName: 'Name',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
			{
				name: 'description',
				displayName: 'Description',
				getContentCallback: fieldListItemContent.getTextFromItemField,
			},
		];

		const addEditForm = props => (<FieldListForm {...props} />);

		return (
			<ListPage
				onProjectChanged={this.props.onProjectChanged}
				fields={fields}
				keyName="name"
				project={this.props.project}
				projectFilePath={this.props.projectFilePath}
				projectPropName="characters"
				addEditFormEditTitle="Edit Character"
				addEditFormAddTitle="Add Character"
				addEditForm={addEditForm}
				addEditFormSchema={[
					{
						fieldName: 'name',
						label: 'Name',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'description',
						label: 'Description',
						readOnly: false,
						multiline: true,
					},
				]}
			/>
		);
	}
}

CharacterPage.propTypes = {
	onProjectChanged: PropTypes.func.isRequired,

	project: PropTypes.object,
	projectFilePath: PropTypes.string.isRequired,
};

CharacterPage.defaultProps = {
	project: null,
};

export default withStyles(themes.defaultTheme)(CharacterPage);
