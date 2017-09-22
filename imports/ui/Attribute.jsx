import React, { Component, PropTypes } from 'react';

export default class Attribute extends Component {
	render() {
		let icon = 'fa-ban';
		let value = 'no';
		let alt = 'No';
		if (this.props.att.isTrue) {
			icon = 'fa-thumbs-up';
			value = 'yes';
			alt = 'Yes!';
		}

		return (
			<div className={`attribute attribute-${value}`}>
				<span className="attribute-icon">
					<i className={`fa ${icon}`} role="img" aria-hidden="true" title={alt}></i>
					<span className="sr-only">{alt}</span>
				</span>
				<span className="attribute-name">
					{this.props.att.name}
				</span>
			</div>
		);
	}
}

Attribute.propTypes = {
	att: PropTypes.object.isRequired
};
