import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';

const AllFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/allFeedbacks')
            .then(res => res.json())
            .then(data => setFeedbacks(data));
    }, []);

    return (
        <div className="bg-white rounded p-4 m-4">
            <h4 className="text-danger mb-4">Customer Feedbacks</h4>
            <Table className="table-borderless">
                <thead>
                    <tr>
                        <th className="text-secondary" scope="col">Name</th>
                        <th className="text-secondary" scope="col">Email</th>
                        <th className="text-secondary" scope="col">Feedback</th>
                        <th className="text-secondary" scope="col">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center font-weight-bold">No Feedbacks Found</td>
                        </tr>
                    ) : (
                        feedbacks.map((feedback, index) =>
                            <tr key={index}>
                                <td>{feedback.name}</td>
                                <td>{feedback.email}</td>
                                <td>{feedback.comment}</td>
                                <td>{feedback.rating} / 5</td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AllFeedbacks;
