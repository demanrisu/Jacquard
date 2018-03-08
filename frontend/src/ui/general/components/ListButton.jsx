import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
	},
});

class ListButton extends React.Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick(this.props.itemKey);
	}

	render() {
		const { classes } = this.props;
		return (
			<Button variant="fab" color={this.props.color} onClick={this.onClick} aria-label={this.props.arialabel} className={classes.button}>
				{this.props.children}
			</Button>
		);
	}
}

export default withStyles(styles)(ListButton);
