import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

const LineGraph = ({ data }) => {

	// Fallback if data is not yet loaded
	const chartData = data && data.length > 0 ? data : [];

	return (
		<div>
			<h4 className="mt-2 py-2">Weekly Orders</h4>
			<BarChart
				width={600}
				height={400}
				data={chartData}
				margin={{
					top: 10,
					right: 1,
					left: 0,
					bottom: 5
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="Order_Placed" fill="#8884d8" />
				<Bar dataKey="Order_Completed" fill="#82ca9d" />
			</BarChart>
		</div>
	);
};

export default LineGraph;
