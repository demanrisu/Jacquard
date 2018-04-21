import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import FieldListForm from '../../general/components/FieldListForm';

class CharacterPage extends React.Component {
	render() {
		const fieldNames = ['name', 'description'];
		const displayNames = ['Name', 'Description'];
		const addEditForm = props => (<FieldListForm {...props} />);

		return (
			<ListPage
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="name"
				currentProject={this.props.currentProject}
				currentProjectPropName="characters"
				editFormTitle="Edit Character"
				addFormTitle="Add Character"
				addEditForm={addEditForm}
				formSchema={[
					{
						fieldName: 'name',
						label: 'Name',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'description',
						label: 'description',
						readOnly: false,
						multiline: true,
					},
				]}
			/>
		);
	}
}

CharacterPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
};

CharacterPage.defaultProps = {
	currentProject: null,
};

export default withStyles(themes.defaultTheme)(CharacterPage);
