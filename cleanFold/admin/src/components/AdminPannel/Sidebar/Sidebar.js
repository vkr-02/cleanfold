import {
	faCalendar,
	faHome,
	faMailBulk,
	faShoppingBasket,
	faSignOutAlt,
	faUserPlus,
	faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Authentication/useAuth';
import './Sidebar.css';

const Sidebar = () => {

	const auth = useAuth();

	return (
		<div className="sidebar d-flex flex-column py-4 px-3" style={{ height: '100vh' }}>
			<ul className="list-unstyled nav flex-column">
				<li className="nav-item title-item">
					<Link to="/admin" className="text-white nav-link ">
						<span className="sidebar-title">Clean Fold</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/dashboard" className="text-white nav-link">
						<FontAwesomeIcon icon={faHome} /> <span>Dashboard</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/allOrders" className="text-white nav-link ">
						<FontAwesomeIcon icon={faCalendar} /> <span>Orders</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/products" className="text-white nav-link">
						<FontAwesomeIcon icon={faShoppingBasket} /> <span>Products</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/customers" className="text-white nav-link">
						<FontAwesomeIcon icon={faUsers} /> <span>Customers</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/registration" className="text-white nav-link ">
						<FontAwesomeIcon icon={faUserPlus} /> <span>Registration</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/support" className="text-white nav-link ">
						<FontAwesomeIcon icon={faMailBulk} /> <span>Support</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin/feedback" className="text-white nav-link ">
						<FontAwesomeIcon icon={faMailBulk} /> <span>Feedback</span>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/admin" className="text-white nav-link" onClick={() => auth.signOut()}>
						<FontAwesomeIcon icon={faSignOutAlt} /> <span>Logout</span>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
