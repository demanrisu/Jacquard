import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';

import ListPage from '../../general/pages/ListPage';
import themes from '../themes';
import NodeEditor from '../modals/NodeEditor';

class NodeListPage extends React.Component {
	render() {
		const fieldNames = ['section', 'title', 'tag'];
		const displayNames = ['Section', 'Title', 'Tags'];

		const addEditForm = props => (<NodeEditor {...props} />);

		return (
			<ListPage
				onCurrentProjectChanged={this.props.onCurrentProjectChanged}
				fieldNames={fieldNames}
				displayNames={displayNames}
				keyName="title"
				currentProject={this.props.currentProject}
				currentProjectPropName="nodes"
				editFormTitle="Edit Node"
				addFormTitle="Add Node"
				addEditForm={addEditForm}
				formSchema={[
					{
						fieldName: 'title',
						label: 'Title',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'tag',
						label: 'Tag',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'section',
						label: 'Section',
						readOnly: false,
						multiline: false,
					},
					{
						fieldName: 'content',
						label: 'Content',
						readOnly: false,
						multiline: false,
					},
				]}
			/>
		);
	}
}

NodeListPage.propTypes = {
	onCurrentProjectChanged: PropTypes.func.isRequired,

	currentProject: PropTypes.object,
};

NodeListPage.defaultProps = {
	currentProject: null,
};

export default withStyles(themes.defaultTheme)(NodeListPage);
