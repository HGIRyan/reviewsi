import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

class SentStatsGraph extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { height, width, sent, open, feedback, click } = this.props;
		let percent = { open: ((open / sent) * 100).toFixed(0), feedback: ((feedback / open) * 100).toFixed(0), click: ((click / feedback) * 100).toFixed(0) };
		return (
			<div style={{ height, width, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
				{/* Opened */}
				<div
					style={{
						height: `${100 - percent.open}%`,
						width: '100%',
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'center',
						margin: '0',
					}}
					data-tip
					className="sent"
					data-for="sent"
				>
					{percent.open}%
				</div>
				<div
					style={{
						height: `${percent.open}%`,
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
					}}
				>
					{/* Feedback */}
					<div
						style={{
							height: `${100 - percent.open}%`,
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-end',
							flexDirection: 'column',
							margin: '0',
						}}
						className="opened"
						data-tip
						data-for="open"
					>
						{percent.feedback}%
					</div>
					<div
						style={{
							height: `${percent.feedback}%`,
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-end',
							flexDirection: 'column',
							margin: '0',
						}}
						className="feedback"
					>
						{/* Clicked */}
						<div
							style={{
								height: `${100 - percent.feedback}%`,
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								margin: '0',
							}}
							// className="feedback"
							data-tip
							data-for="feedback"
						>
							{percent.click}%
						</div>
						<div
							style={{ height: `${percent.click}%`, width: '100%', display: 'flex', alignItems: 'flex-end', margin: '0' }}
							data-tip
							data-for="click"
							className="click"
						/>
					</div>
				</div>
				<ReactTooltip id="click" type="dark" effect="float" place="bottom">
					<span>Total Clicked</span>
					<br />
					<span>{percent.click}%</span>
				</ReactTooltip>
				<ReactTooltip id="feedback" type="dark" effect="float" place="bottom">
					<span>Total Survey Responses</span>
					<br />
					<span>{percent.feedback}%</span>
				</ReactTooltip>
				<ReactTooltip id="sent" type="dark" effect="float" place="bottom">
					<span>Total Sent</span>
					<br />
					<span>{sent}</span>
				</ReactTooltip>
				<ReactTooltip id="open" type="dark" effect="float" place="bottom">
					<span>Total Opened</span>
					<br />
					<span>{percent.open}%</span>
				</ReactTooltip>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(SentStatsGraph);
