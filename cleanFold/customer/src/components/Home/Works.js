import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import PlaceIcon from '@material-ui/icons/Place';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Timeline from '@material-ui/lab/Timeline';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import '../../App.css';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: '20px 30px',
		transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
		cursor: 'pointer',
		borderRadius: '16px',
		'&:hover': {
			transform: 'translateY(-5px) scale(1.03)',
			boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.25)',
		},
		'&:hover $title': {
			color: '#ef4444',
		},
		'&:active': {
			transform: 'translateY(-2px) scale(0.98)',
		}
	},
	title: {
		fontWeight: 700,
		color: '#1a202c',
		transition: 'color 0.3s ease'
	},
	dot: {
		transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
		cursor: 'pointer',
		'&:hover': {
			transform: 'scale(1.4) rotate(15deg)',
			boxShadow: '0 0 15px rgba(239, 68, 68, 0.6) !important'
		}
	},
	secondaryTail: {
		backgroundColor: theme.palette.secondary.main
	}
}));

const Works = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<section id="works" className="mb-5">
			<Container>
				<div className="d-flex justify-content-center mb-4">
					<h2 className="text-danger head-title mt-5">How It Works</h2>
				</div>
				<Row>
					<Col md={12}>
						<Timeline align="alternate">
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/services')}>
										<AssignmentTurnedInIcon />
									</TimelineDot>
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/services')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Select Service
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/services')}>
										<LocalMallIcon />
									</TimelineDot>
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/services')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Place Order
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/cart-and-shipment')}>
										<ScheduleIcon />
									</TimelineDot>
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/cart-and-shipment')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Set Schedule
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/dashboard')}>
										<PlaceIcon />
									</TimelineDot>
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/dashboard')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Pick up
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/wash-and-iron')}>
										<LocalLaundryServiceIcon />
									</TimelineDot>
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/wash-and-iron')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Wash & Iron
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="secondary" className={classes.dot} onClick={() => history.push('/dashboard')}>
										<DirectionsBikeIcon />
									</TimelineDot>
								</TimelineSeparator>
								<TimelineContent>
									<Paper elevation={3} className={classes.paper} onClick={() => history.push('/dashboard')}>
										<Typography variant="h6" component="h1" className={classes.title}>
											Delivery
										</Typography>
									</Paper>
								</TimelineContent>
							</TimelineItem>
						</Timeline>
					</Col>


				</Row>
			</Container>
		</section>
	);
};

export default Works;
