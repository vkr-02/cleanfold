import React from 'react';
import { Col, Row } from 'reactstrap';
import Sidebar from '../Sidebar/Sidebar';
import AllFeedbacks from './AllFeedbacks';

const containerStyle = {
    backgroundColor: '#F4FDFB',
    height: '100vh'
};

const Feedbacks = () => {
    return (
        <Row style={containerStyle}>
            <Col md={2}>
                <Sidebar />
            </Col>
            <Col md={10} className="pl-5 pt-4">
                <AllFeedbacks />
            </Col>
        </Row>
    );
};

export default Feedbacks;
