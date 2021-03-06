import React from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';

import Divider from '@material-ui/core//Divider';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import orange from '@material-ui/core/colors/orange';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

import themes from '../themes';
import packageFile from '../../../../package.json';

const styles = theme => ({
	...themes.defaultTheme(theme),
	dataChanged: {
		backgroundColor: orange[500],
	},
});

function urlPush(url, history) {
	return () => {
		history.push(url);
	}
}

function getSaveProjectClasses(modified, classes) {
	if (modified) return { root: classes.dataChanged }
	return {}
};

function renderProjectMenu() {
	const { hasProject, projectIsModified, classes, onSaveProject } = this.props;
	const { onSaveProjectAs, onExportYarnFile, onCloseProject } = this.props;

	if (!hasProject) return null;
	const saveProjectClasses = getSaveProjectClasses(projectIsModified, classes);

	return (
			<div>
			<Divider />
			<List>
				<Link to="/visualization">
					<MenuItem button>
						<ListItemText primary="Visualization" />
					</MenuItem>
				</Link>
			</List>
			<Divider />
			<List>
				<Link to="/nodes">
					<MenuItem button>
						<ListItemText primary="Nodes" />
					</MenuItem>
				</Link>
				<MenuItem button disabled={true} onClick={urlPush("/characters", this.props.history)}>
					<ListItemText primary="Characters" />
				</MenuItem>
				<MenuItem button disabled={true} onClick={urlPush("/functions", this.props.history)}>
					<ListItemText primary="Functions" />
				</MenuItem>
				<MenuItem button disabled={true} onClick={urlPush("/variables", this.props.history)}>
					<ListItemText primary="Variables" />
				</MenuItem>
				<MenuItem button onClick={urlPush("/options", this.props.history)}>
					<ListItemText primary="Project Options" />
				</MenuItem>
			</List>
			<Divider />
			<List>
				<MenuItem
					button
					classes={saveProjectClasses}
					onClick={onSaveProject}
				>
					<ListItemText primary="Save Project" />
				</MenuItem>
				<MenuItem button onClick={onSaveProjectAs}>
					<ListItemText primary="Save Project As..." />
				</MenuItem>
				<MenuItem button onClick={onExportYarnFile}>
					<ListItemText primary="Export Project To Yarn" />
				</MenuItem>
				<MenuItem button onClick={urlPush("/export", this.props.history)}>
					<ListItemText primary="Export Project Bytecode" />
				</MenuItem>
				<MenuItem button onClick={onCloseProject}>
					<ListItemText primary="Close Project" />
				</MenuItem>
			</List>
		</div>
	);
}

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;
		return (
			<Drawer
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div>
					<Typography variant="title" align="center">Jacquard {packageFile.version}</Typography>
				</div>
				<Divider />
				<Link to="/"><MenuItem button><ListItemText primary="Home" /></MenuItem></Link>
				<Divider />
				<Link to="/preview"><MenuItem button><ListItemText primary="Preview" /></MenuItem></Link>
				{renderProjectMenu.call(this)}
				<Divider />
				<List>
					<MenuItem button onClick={this.props.onCreateNewProject}>
						<ListItemText primary="Create New Project" />
					</MenuItem>
					<MenuItem button onClick={this.props.onOpenExistingProject}>
						<ListItemText primary="Open Existing Project" />
					</MenuItem>
					<MenuItem button onClick={this.props.onImportYarnFile}>
						<ListItemText primary="Import Project From Yarn" />
					</MenuItem>
				</List>
			</Drawer>
		);
	}
}

export default withRouter(withStyles(styles)(MainMenu));
