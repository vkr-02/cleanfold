import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import LineGraph from './LineGraph';
import PieGraph from './PieGraph';
import StaticalView from './StaticalView';

const containerStyle = {
	backgroundColor: '#F4FDFB',
	height: '100vh'
};

const AdminDashboard = () => {
	const [stats, setStats] = useState({
		pieData: [],
		weeklyData: []
	});

	useEffect(() => {
		fetch('http://localhost:5000/dashboardStats')
			.then(res => res.json())
			.then(data => {
				setStats(data);
			})
			.catch(err => console.error("Error loading dashboard stats:", err));
	}, []);

	return (
		<section>
			<div style={containerStyle}>
				<Row>
					<Col md={2}>
						<Sidebar />
					</Col>
					<Col md={10} className="pl-5 pt-4">
						<StaticalView />

						<div className="row mt-4">
							<div className="col-md-7">
								<LineGraph data={stats.weeklyData} />
							</div>
							<div className="col-md-5 ">
								<PieGraph data={stats.pieData} />
							</div>
						</div>
					</Col>
				</Row>
			</div>
		</section>
	);
};

export default AdminDashboard;
