import React, { Component, PropTypes } from 'react';

export default class Color extends Component {

	// Thank you, https://stackoverflow.com/a/5624139
	hexToRgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	// Thank you, https://stackoverflow.com/a/1855903
	isColorLight(hex) {
		const rgb = this.hexToRgb(hex);
		// Compute the perceptive luminance, keeping
		// in mind that the human eye favors green.
		return (1 - ( 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b ) / 255) < 0.5;
	}

	render() {
		const colorClass = this.isColorLight(this.props.color.webColor) ? 'light' : 'dark';
		const colorStyle = {
			backgroundColor: this.props.color.webColor
		};
		return (
			<span className={`color color-${colorClass}`} style={colorStyle}>{this.props.color.name}</span>
		)
	}
}

Color.propTypes = {
	color: PropTypes.object.isRequired
};
