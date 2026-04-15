import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useAuth } from '../Authentication/useAuth';

const FeedbackForm = ({ closeModal }) => {
    const auth = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const feedbackData = {
            name: auth.user.displayName || auth.user.name,
            email: auth.user.email,
            rating,
            comment,
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
                closeModal();
            }
        });
    };

    return (
        <div className="p-4">
            <h3 className="text-danger mb-4 text-center">Give Us Your Feedback</h3>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="rating">Rating (1-5)</Label>
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
                <FormGroup>
                    <Label for="comment">Your Feedback</Label>
                    <Input 
                        type="textarea" 
                        name="comment" 
                        id="comment" 
                        rows="4" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        required 
                    />
                </FormGroup>
                <Button color="danger" type="submit" className="w-100 mt-3 mb-2">Submit Feedback</Button>
                <Button color="secondary" type="button" className="w-100" onClick={closeModal}>Cancel</Button>
            </Form>
        </div>
    );
};

export default FeedbackForm;
