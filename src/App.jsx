// React Imports
import React, { Component } from 'react';
import { HashRouter as Router, Route, withRouter } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core//styles';

// Electron Imports
import { ipcRenderer } from 'electron'; // eslint-disable-line

// General Component Imports
import Page from './ui/general/pages/Page';

// Page Imports
import VisualizationPage from './ui/domain/pages/VisualizationPage';
import CharacterPage from './ui/domain/pages/CharacterPage';
import DefaultPage from './ui/domain/pages/DefaultPage';
import ExportPage from './ui/domain/pages/ExportPage';
import FunctionPage from './ui/domain/pages/FunctionPage';
import NodePage from './ui/domain/pages/NodePage';
import OptionsPage from './ui/domain/pages/OptionsPage';
import VariablePage from './ui/domain/pages/VariablePage';
import PreviewPage from './ui/domain/pages/PreviewPage';
import MainMenu from './ui/domain/components/MainMenu';

import projectService from './services/projectService';
import yarnService from './services/yarnService';

import { Provider as ReduxStoreProvider } from 'react-redux';

import assignActions from './actions/assign';
import createStore from './store';

const theme = createMuiTheme();

const store = createStore();
assignActions(store);

class App extends Component {
	constructor(props) {
		super(props);

		// Set up the initial state
		this.state = {
			// We don't have a project initially
			project: null,
			// Whether the project has been modified
			projectIsModified: false,
		};

		// Set up a handler for when the project file path changes
		// The new project file path is passed as the "arg" parameter
		ipcRenderer.on('project-file-path-changed', (event, arg) => {
			// Update the project file path
			projectService.setFilePath(arg);

			// Set the project file path
			ipcRenderer.send('setProjectFilePath', arg);
		});

		// Set up a handler for when a project is loaded
		// The loaded project will be passed as a JSON string in the "arg"
		// parameter
		ipcRenderer.on('project-loaded', (event, arg) => {
			// The project
			let project = null;

			// Convert the JSON string to an object
			try {
				project = JSON.parse(arg);
			} catch (error) {
				// Show the error to the user
				ipcRenderer.send('showError', 'Project is not a JSON file.');
			}

			// Store the loaded project
			projectService.set(project);

			// Record the loaded project in our state
			this.setState(
				{
					project,
				},
				// Navigate to the Nodes page
				() => this.navigateToNodes(),
			);
		});

		// Set up a handler for when a Yarn file is loaded
		// The loaded project will be passed as a string in the "arg"
		// parameter
		ipcRenderer.on('yarn-loaded', (event, arg) => {
			// Convert the Yarn string to an object
			const project = yarnService.importProjectFromYarn(arg);

			// Store the loaded project
			projectService.set(project);

			// Record the loaded project in our state
			this.setState(
				{
					project,
				},
				// Navigate to the Nodes page
				() => this.navigateToNodes(),
			);
		});
	}

	componentWillMount() {
		// Get the project (if any)
		const project = projectService.get();

		// Record the project (if any) in our state
		this.setState({
			project,
		});
	}

	onSaveProject = () => {
		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Convert the project to JSON
		const projectJSON = JSON.stringify(this.state.project);

		// Save the project to the current file path
		ipcRenderer.send('projectSave', {
			projectJSON,
			projectFilePath,
		});

		// The project has been saved, so mark it as unmodified
		this.setState(
			{
				projectIsModified: false,
			},
			() => {
				// Tell Electron whether the project is modified
				ipcRenderer.send('setProjectModified', this.state.projectIsModified);
			},
		);
	};

	onSaveProjectAs = () => {
		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Convert the project to JSON
		const projectJSON = JSON.stringify(this.state.project);

		// Save the project under another name
		ipcRenderer.send('projectSaveAs', {
			projectJSON,
			projectFilePath,
		});
	};

	onCreateNewProject = () => {
		// Create a new project
		const newProject = {
			name: 'New Project',
			nodes: [],
			characters: [],
			functions: [],
			variables: [],
		};

		// Store the new project
		projectService.set(newProject);

		// Record the new project in our state
		this.setState(
			{
				project: newProject,
			},
			// Navigate to the Nodes page
			() => this.navigateToNodes(),
		);
	}

	onExportYarnFile = () => {
		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Convert the project to Yarn
		const projectYarn = yarnService.exportProjectToYarn(this.state.project);

		// Export the project as a yarn file
		ipcRenderer.send('projectExportToYarn', {
			projectYarn,
			projectFilePath,
		});
	};

	onImportYarnFile = () => {
		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Open a project
		ipcRenderer.send('projectImportFromYarn', projectFilePath);
	};

	onCloseProject = () => {
		// Remove the project from storage
		projectService.clear();

		// Clear the project from our state
		this.setState(
			{
				project: null,
			},
			// Navigate back to the home page
			() => this.navigateToHome(),
		);
	};

	onOpenExistingProject = () => {
		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Open a project
		ipcRenderer.send('projectOpen', projectFilePath);
	};

	onProjectUpdated = (updatedProject) => {
		// Store the updated project
		projectService.set(updatedProject);

		// Record the updated project in our state, and set the project as
		// modified
		this.setState(
			{
				project: updatedProject,
				projectIsModified: true,
			},
			() => {
				// Tell Electron whether the project is modified
				ipcRenderer.send('setProjectModified', this.state.projectIsModified);
			},
		);
	}

	onDataModified = () => {
		// Tell Electron the project is modified (since the user has changed
		// data in one of the pages)
		ipcRenderer.send('setProjectModified', true);
	}

	navigateToHome = () => {
		this.props.history.push('/');
	};

	navigateToNodes = () => {
		this.props.history.push('/nodes');
	};

	render() {
		// Determine whether we have a project
		const hasProject = !!this.state.project;

		// Get the project file path
		const projectFilePath = projectService.getFilePath();

		// Build the app components
		const Menu = () =>	(<MainMenu
			hasProject={hasProject}
			projectIsModified={this.state.projectIsModified}
			onCreateNewProject={this.onCreateNewProject}
			onSaveProject={this.onSaveProject}
			onSaveProjectAs={this.onSaveProjectAs}
			onOpenExistingProject={this.onOpenExistingProject}
			onImportYarnFile={this.onImportYarnFile}
			onExportYarnFile={this.onExportYarnFile}
			onCloseProject={this.onCloseProject}
		/>);

		const BasePage = props => (
			<Page mainMenu={Menu} title={props.title}>
				{props.children}
			</Page>
		);

		const HomePageComplete = () => (
			<BasePage title="Home">
				<DefaultPage />
			</BasePage>
		);

		const PreviewPageComplete = () => (
			<BasePage title="Preview">
				<PreviewPage project={this.state.project}/>
			</BasePage>
		);

		const VisualizationPageComplete = () => (
			<BasePage title="Visualization">
				<VisualizationPage
					project={this.state.project}
					projectFilePath={projectFilePath}
					onProjectUpdated={this.onProjectUpdated}
					onDataModified={this.onDataModified}
				/>
			</BasePage>
		);

		const CharacterPageComplete = () => (
			<BasePage title="Characters">
				<CharacterPage
					project={this.state.project}
					projectFilePath={projectFilePath}
					onProjectUpdated={this.onProjectUpdated}
					onDataModified={this.onDataModified}
				/>
			</BasePage>
		);

		const OptionsPageComplete = () => (
			<BasePage title="Project Options">
				<OptionsPage project={this.state.project}
					onProjectUpdated={this.onProjectUpdated}
				/>
			</BasePage>
		);

		const FunctionPageComplete = () => (
			<BasePage title="Functions">
				<FunctionPage
					project={this.state.project}
					projectFilePath={projectFilePath}
					onProjectUpdated={this.onProjectUpdated}
					onDataModified={this.onDataModified}
				/>
			</BasePage>
		);

		const ExportPageComplete = () => (
			<BasePage title="Export">
				<ExportPage
					project={this.state.project}
				/>
			</BasePage>
		);

		const NodePageComplete = () => (
			<BasePage title="Nodes">
				<NodePage
					project={this.state.project}
					projectFilePath={projectFilePath}
					onProjectUpdated={this.onProjectUpdated}
					onDataModified={this.onDataModified}
				/>
			</BasePage>
		);

		const VariablePageComplete = () => (
			<BasePage title="Variables">
				<VariablePage
					project={this.state.project}
					projectFilePath={projectFilePath}
					onProjectUpdated={this.onProjectUpdated}
					onDataModified={this.onDataModified}
				/>
			</BasePage>
		);

		return (
			<div>
				<Route exact path="/" component={HomePageComplete} />
				<Route path="/visualization" component={VisualizationPageComplete} />
				<Route path="/characters" component={CharacterPageComplete} />
				<Route path="/export" component={ExportPageComplete} />
				<Route path="/functions" component={FunctionPageComplete} />
				<Route path="/nodes" component={NodePageComplete} />
				<Route path="/variables" component={VariablePageComplete} />
				<Route path="/preview" component={PreviewPageComplete} />
				<Route path="/options" component={OptionsPageComplete} />
			</div>
		);
	}
}

const AppContainer = () => {
	// Wrap the app so it has access to the routers match, location, and history props
	const AppWithRouter = withRouter(App);

	return (
		<ReduxStoreProvider store={store}>
			<MuiThemeProvider theme={theme}>
				<Router>
					<AppWithRouter />
				</Router>
			</MuiThemeProvider>
		</ReduxStoreProvider>
	);
};

export default AppContainer;
