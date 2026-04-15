import React, { useState } from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';

const CustomerFeedback = () => {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const feedbackData = {
            name,
            email,
            rating,
            comment: '',
            date: new Date().toISOString()
        };

        fetch('http://localhost:5000/addFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for your feedback!');
                setName('');
                setEmail('');
                setRating(5);
            }
        });
    };

    return (
        <section id="feedback" className="mb-5">
            <Container>
                <div className="d-flex justify-content-center mb-4">
                    <h2 className="text-danger head-title mt-1">Leave A Feedback</h2>
                </div>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
                            <FormGroup>
                                <label htmlFor="name">Full Name</label>
                                <Input id="name" placeholder="Your full name" type="text" value={name} onChange={e => setName(e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="email">Email Address</label>
                                <Input id="email" placeholder="name@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="rating">Rating (1-5)</label>
                                <Input 
                                    type="select" 
                                    name="rating" 
                                    id="rating" 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                            <Button color="danger" className="nav-name mt-3 w-100" type="submit">
                                <i className="now-ui-icons ui-1_send" /> Submit Feedback
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default CustomerFeedback;
