import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import themes from '../themes';

import CompilePanel from '../components/Preview/CompilePanel';
import TextWindow from '../components/Preview/TextWindow';
import Interface from '../components/Preview/Interface';
import InfoPanel from '../components/Preview/InfoPanel';

import { OptionSelect, FuncValue } from '../../../actions/preview/runtime';

class RuntimePage extends React.Component {	
	render() {
		return (
			<div>
				<CompilePanel project={this.props.project}/>
				<Interface/>
				<TextWindow 
					key="textDisplay"
					className="display"
					text={this.props.text}
					options={this.props.options}
					optionSelect={OptionSelect}
					func={this.props.func}
					funcValue={FuncValue}
					halted={this.props.halted}
					endOfFile={this.props.endOfFile}
				/>
				<InfoPanel/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	const Runtime = state.Preview.State;
  return {
    options: Runtime.options,
		func: Runtime.currentFunc,
		text: Runtime.text,
		halted: Runtime.halted,
		endOfFile: Runtime.endOfFile,
  }
}

export default connect(mapStateToProps)(withStyles(themes.defaultTheme)(RuntimePage));
