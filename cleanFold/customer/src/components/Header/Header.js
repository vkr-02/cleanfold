import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Container,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Modal,
	Nav,
	Navbar,
	NavbarBrand,
	NavItem,
	NavLink,
	UncontrolledCollapse,
	UncontrolledDropdown
} from 'reactstrap';
import '../../App.css';
import userPhoto from '../../images/auth/man.png';
import Logo from '../../images/icon.svg';
import { useAuth } from '../Authentication/useAuth';

const Header = (props) => {
	const auth = useAuth();

	const [modalLive, setModalLive] = useState(false);

	const totalQuantity = props.cart.reduce((totalQuantity, product) => {
		return totalQuantity + product.quantity;
	}, 0);

	return (
		<Navbar className="sticky-top bg-danger" expand="lg">
			<Container>
				<div className="navbar-translate">
					<Link to="/">
						<NavbarBrand onClick={(e) => e.preventDefault()}>
							<div className="row align-items-center">
								<img src={Logo} alt="Clean Fold" /> <span className="lead mx-1">Clean Fold</span>
							</div>
						</NavbarBrand>
					</Link>
					<button className="navbar-toggler" id="navbar-danger" type="button">
						<i className="text-white now-ui-icons arrows-1_minimal-down" />
						<span className="navbar-toggler-bar bar1" />
						<span className="navbar-toggler-bar bar2" />
						<span className="navbar-toggler-bar bar3" />
						<span className="navbar-toggler-bar bar4" />
						<span className="navbar-toggler-bar bar5" />
					</button>
				</div>
				<UncontrolledCollapse navbar toggler="#navbar-danger">
					<Nav className="ml-auto" navbar>
						<NavItem>
							<Link to="/">
								<NavLink>
									<i className="now-ui-icons shopping_shop" />
									<p className="nav-name">Home</p>
								</NavLink>
							</Link>
						</NavItem>
						{auth.user && (
							<>
								<NavItem>
									<Link to="/services">
										<NavLink>
											<i className="now-ui-icons loader_gear spin" />
											<p className="nav-name">Services</p>
										</NavLink>
									</Link>
								</NavItem>
								<NavItem>
									<Link to="/cart-and-shipment">
										<NavLink>
											<i className="now-ui-icons shopping_bag-16" />
											<p className="nav-name">
												Bag
												{totalQuantity ? (
													<span className="badge ml-1">{totalQuantity}</span>
												) : (
													<span />
												)}
											</p>
										</NavLink>
									</Link>
								</NavItem>
								<NavItem>
									<Link to="/dashboard">
										<NavLink>
											<i className="now-ui-icons objects_spaceship" />
											<p className="nav-name">Dashboard</p>
										</NavLink>
									</Link>
								</NavItem>
							</>
						)}
						<NavItem>
							{auth.user ? (
								<UncontrolledDropdown nav>
									<DropdownToggle
										aria-haspopup={true}
										caret
										color="default"
										data-toggle="dropdown"
										id="navbarDropdownMenuLink"
										nav
										onClick={(e) => e.preventDefault()}
									>
										{auth.user.displayName}
										<img
											className="ml-3"
											src={auth.user.photoURL ? auth.user.photoURL : userPhoto}
											width="35px"
											alt="user"
										/>
									</DropdownToggle>
									<DropdownMenu aria-labelledby="navbarDropdownMenuLink">
										<DropdownItem onClick={() => setModalLive(true)}>My Profile</DropdownItem>
										<DropdownItem
											onClick={() => {
												auth.signOut();
											}}
										>
											Sign Out
										</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							) : (
								<Link to="/login">
									<NavLink>
										<i className="now-ui-icons users_single-02" />
										<p className="nav-name">Login</p>
									</NavLink>
								</Link>
							)}
						</NavItem>
					</Nav>
				</UncontrolledCollapse>

				<Modal toggle={() => setModalLive(false)} isOpen={modalLive}>
					<div className="modal-header">
						<h5 className="modal-title text-danger" id="exampleModalLiveLabel">
							My Profile
						</h5>
						<button aria-label="Close" className="close" type="button" onClick={() => setModalLive(false)}>
							<span aria-hidden={true}>×</span>
						</button>
					</div>
					<div className="modal-body text-center">
						<img
							className="mb-3 rounded-circle"
							src={auth.user?.photoURL ? auth.user.photoURL : (auth.user?.photo ? auth.user.photo : userPhoto)}
							width="100px"
							alt="user"
						/>
						<h4>{auth.user?.displayName || auth.user?.name}</h4>
						<p className="text-muted">{auth.user?.email}</p>
					</div>
					<div className="modal-footer">
						<Button color="danger" type="button" onClick={() => setModalLive(false)} className="w-100">
							Close
						</Button>
					</div>
				</Modal>
			</Container>
		</Navbar>
	);
};

export default Header;
