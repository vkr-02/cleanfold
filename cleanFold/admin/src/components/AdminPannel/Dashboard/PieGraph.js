import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Legend, RadialBar, RadialBarChart } from 'recharts';

const useStyles = makeStyles({
	root: {
		width: '90%',
		marginLeft: '-20px',
		marginTop: '20px'
	}
});

const PieGraph = ({ data }) => {
	const classes = useStyles();

	// Calculate real completion rate from data
	const chartData = data && data.length > 0 ? data : [];

	const findUV = (name) => {
		const item = chartData.find(d => d.name === name);
		return item ? item.uv : 0;
	};

	const completed = findUV('Completed');
	const totalOrders = ['Placed', 'Picked', 'Progress', 'Delivered', 'Completed'].reduce((acc, name) => acc + findUV(name), 0);

	const completionRate = totalOrders > 0 ? (completed / totalOrders) * 100 : 0;
	const bufferRate = Math.min(completionRate + 15, 100);

	const style = {
		top: 50,
		left: 310,
		lineHeight: '24px'
	};

	return (
		<div>
			<h4 className="mt-2 py-3">Business Report</h4>
			<RadialBarChart
				width={500}
				height={400}
				cx={150}
				cy={200}
				innerRadius={20}
				outerRadius={160}
				barSize={15}
				data={chartData}
			>
				<RadialBar
					minAngle={15}
					background
					clockWise
					dataKey="uv"
				/>
				<Legend
					iconSize={14}
					width={150}
					height={240}
					layout="vertical"
					verticalAlign="middle"
					wrapperStyle={style}
				/>
			</RadialBarChart>

			<div className={classes.root}>
				<div className="d-flex justify-content-between mb-1">
					<span className="text-secondary small">Order Completion Rate</span>
					<span className="text-dark small font-weight-bold">{Math.round(completionRate)}%</span>
				</div>
				<LinearProgress variant="buffer" value={completionRate} valueBuffer={bufferRate} />
			</div>

			<div className="footer-bottom d-flex justify-content-center mt-2">
				<p className="text-secondary mt-2">Copyright &copy; 2026 Clean Fold </p>
			</div>
		</div>
	);
};

export default PieGraph;
