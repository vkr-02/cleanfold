import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import React, { useContext } from 'react';
import { DataContext } from '../../../App';
import '../Orders/Orders.css';

const AllCustomer = () => {
	const ContextData = useContext(DataContext);
	let count = 0;

	return (
		<div>
			<div className="row d-flex justify-content-between mb-0">
				<h3 className="mt-3">All Customers</h3>

			</div>
			<div className="table-style mt-0">
				<MDBTable>
					<MDBTableHead color="info-color" textWhite>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Email</th>
							<th>Contact</th>
							<th>Room / Flat</th>
							<th>Road</th>
							<th>Address</th>
						</tr>
					</MDBTableHead>
					<MDBTableBody>
						{ContextData.order.map((item) => (
							<tr key={item._id}>
								<th scope="row">{(count = count + 1)}</th>
								<td>{item.shipment.fullName}</td>
								<td>{item.shipment.email}</td>
								<td>{item.shipment.mobileNumber}</td>
								<td>{item.shipment.flat}</td>
								<td>{item.shipment.road}</td>
								<td>{item.shipment.address}</td>
							</tr>
						))}
					</MDBTableBody>
				</MDBTable>
			</div>
		</div>
	);
};

export default AllCustomer;
