import {
  faCloudUploadAlt,
  faMinus,
  faPencilAlt,
  faPlus,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, Table } from 'reactstrap';
import { DataContext } from '../../../App';
import OrderDetails from './OrderDetails';
import './Orders.css';

const AllOrders = () => {
  const ContextData = useContext(DataContext);

  const { register, handleSubmit, watch, errors } = useForm();
  let count = 0;
  let counter = 0;

  const [selectOrder, setSelectOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState();
  const [product, setProduct] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formError, setFormError] = useState('');

  const openOrderModal = (orderId) => {
    setModalIsOpen(true);
    const selectedOrder = ContextData.order.find(
      (item) => item._id === orderId
    );
    setViewOrder(selectedOrder);
  };

  const openDataEditModal = (orderId) => {
    setEditModalIsOpen(true);
    const selectedOrder = ContextData.order.find(
      (item) => item._id === orderId
    );
    setSelectOrder(selectedOrder);
    setProduct(selectedOrder.products);
  };

  const handleStatusChange = (status, order) => {
    let progress;
    if (status == 'Order Placed') {
      progress = 20;
    } else if (status == 'Order Picked') {
      progress = 40;
    } else if (status == 'Order Processing') {
      progress = 60;
    } else if (status == 'Order Delivered') {
      progress = 80;
    } else if (status == 'Order Completed') {
      progress = 100;
    }

    const data = { _id: order._id, status, progress };

    // Updating Data to DataContext
    const newDataArray = [...ContextData.order];
    const modifiedData = { ...order, status, progress };
    const selectedIndex = newDataArray.findIndex((item) => item._id === order._id);

    if (selectedIndex !== -1) {
      newDataArray.splice(selectedIndex, 1, modifiedData);
      ContextData.setOrder(newDataArray);
    }

    // Storing Data in database
    fetch('http://localhost:5000/updateOrder', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log('Update Success:', data))
      .catch((err) => console.log('Update Error:', err));
  };

  const openDataDeleteModal = (currentProduct) => {
    setDeleteModal(true);
    const reamingProducts = product.filter(
      (item) => item.id !== currentProduct.id
    );
    setProduct(reamingProducts);
  };

  const handleProductQuantity = (productID, productQuantity) => {
    const updateQuantity = product.map((item) => {
      if (item.id === productID) {
        item.quantity = productQuantity;
      }
      return item;
    });
    setProduct(updateQuantity);
  };

  const onSubmit = (data) => {
    // Compose pickup time from 12-hour inputs when provided
    const composedTime = data.getHour && data.getMin && data.getAMPM
      ? `${data.getHour.padStart(2, '0')}:${data.getMin.padStart(2, '0')} ${data.getAMPM}`
      : data.getTime || selectOrder.shipment.getTime;

    const details = {
      fullName: selectOrder.shipment.fullName,
      email: selectOrder.shipment.email,
      mobileNumber: selectOrder.shipment.mobileNumber,
      toDoor: selectOrder.shipment.toDoor,
      road: selectOrder.shipment.road,
      address: selectOrder.shipment.address,
      getDate: data.getDate || selectOrder.shipment.getDate,
      getTime: composedTime || selectOrder.shipment.getTime,
      flat: selectOrder.shipment.flat,
    };

    // Validate date is not in the past
    const selectedDate = data.getDate ? new Date(`${data.getDate}T00:00:00`) : null;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selectedDate && selectedDate < todayStart) {
      setFormError('Pickup date cannot be in the past.');
      return;
    }

    // Validate time is between 9:00 and 18:00
    if (data.getHour && data.getMin && data.getAMPM) {
      let hour = parseInt(data.getHour, 10);
      const min = parseInt(data.getMin, 10);
      const ampm = data.getAMPM;
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      if (hour < 9 || hour > 18 || (hour === 18 && min > 0)) {
        setFormError('Pickup time must be between 9:00 AM and 6:00 PM.');
        return;
      }
    }

    // clear any previous form errors
    setFormError('');

    const subTotal = product.reduce((totalPrice, product) => {
      return totalPrice + product.price * product.quantity;
    }, 0);

    let deliveryCharge = 0;
    if (subTotal > 100) {
      deliveryCharge = 0;
    } else if (subTotal > 0) {
      deliveryCharge = 20;
    }

    const grandTotal = subTotal + deliveryCharge;

    const calculatePrice = { subTotal, deliveryCharge, grandTotal };
    const updateOrder = {
      _id: data.id,
      shipment: details,
      products: product,
      price: calculatePrice,
      orderDetails: data.orderDetails || selectOrder.orderDetails,
    };
    console.log(updateOrder);

    // Storing Data to Database
    fetch('http://localhost:5000/updateOrderDetails', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updateOrder),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    setDeleteModal(false);
    setEditModalIsOpen(false);
    window.location.reload();
  };

  // Helpers to format date for input[type=date] and parse stored time into 12-hour parts
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  const parseTimeParts = (timeStr) => {
    if (!timeStr) return { hour: '', min: '', ampm: '' };
    const trimmed = timeStr.trim();
    // If already in 12-hour with AM/PM
    const ampmMatch = trimmed.match(/(AM|PM)$/i);
    if (ampmMatch) {
      const parts = trimmed.replace(/(AM|PM)$/i, '').trim().split(':');
      return { hour: parts[0] || '', min: parts[1] || '', ampm: ampmMatch[0].toUpperCase() };
    }
    // If in 24-hour hh:mm
    if (trimmed.includes(':')) {
      const [hh, mm] = trimmed.split(':');
      let hNum = parseInt(hh, 10);
      const ampm = hNum >= 12 ? 'PM' : 'AM';
      let h12 = hNum % 12;
      if (h12 === 0) h12 = 12;
      return { hour: String(h12), min: mm || '00', ampm };
    }
    return { hour: '', min: '', ampm: '' };
  };

  return (
    <div>
      <div className="row d-flex justify-content-between mb-0">
        <h3 className="mt-3">All Orders</h3>

      </div>

      <div className="table-style mt-0 ml-0 mb-4">
        <Table small hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Products</th>
              <th className="text-center">View</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {ContextData.order.map((item) => (
              <tr key={item._id}>
                <th scope="row">{(count = count + 1)}</th>
                <td>{item.orderDetails}</td>
                <td>{item.shipment.fullName?.substr(0, 16)}</td>
                <td>{item.shipment.email}</td>
                <td>{item.shipment.mobileNumber?.substr(0, 11)}</td>
                <td>
                  {new Date(`${item.shipment.getDate}`)
                    .toDateString()
                    ?.substr(0, 10)}
                </td>
                <td className="text-center">{item.products.length}</td>
                <td>
                  <Button
                    className="py-2 my-0 blue-gradient"
                    onClick={() => openOrderModal(item._id)}
                  >
                    View Details
                  </Button>
                </td>
                <td className="pt-2">
                  <select
                    onChange={(e) => handleStatusChange(e.target.value, item)}
                    className={
                      item.status == 'Order Placed'
                        ? 'btn btn-amber my-0 px-2'
                        : item.status == 'Order Picked'
                          ? 'btn btn-secondary my-0 px-2'
                          : item.status == 'Order Processing'
                            ? 'btn btn-danger my-0 px-2'
                            : item.status == 'Order Completed'
                              ? 'btn btn-success my-0 px-2'
                              : 'btn btn-unique my-0 px-2'
                    }
                  >
                    <option
                      selected={item.status == 'Order Placed'}
                      className="bg-white text-secondary"
                    >
                      Order Placed
                    </option>
                    <option
                      selected={item.status == 'Order Picked'}
                      className="bg-white text-secondary"
                    >
                      Order Picked
                    </option>
                    <option
                      selected={item.status == 'Order Processing'}
                      className="bg-white text-secondary"
                    >
                      Order Processing
                    </option>
                    <option
                      selected={item.status == 'Order Delivered'}
                      className="bg-white text-secondary"
                    >
                      Order Delivered
                    </option>
                    <option
                      selected={item.status == 'Order Completed'}
                      className="bg-white text-secondary"
                    >
                      Order Completed
                    </option>
                  </select>
                  <button
                    onClick={() => openDataEditModal(item._id)}
                    className=" ml-2 btn px-3 py-2 peach-gradient  text-white"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          className="modal-xl"
          toggle={() => setModalIsOpen(false)}
          isOpen={modalIsOpen}
        >
          <OrderDetails viewOrder={viewOrder} setModalIsOpen={setModalIsOpen} />
        </Modal>

        <Modal className="modal-xl" isOpen={editModalIsOpen}>
          {selectOrder && (
            <div className="px-5 my-3 single-order">
              <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <h3 className="text-info text-center mt-4 mb-2">
                    Customer Details
                  </h3>
                  <button
                    type="button"
                    className="close mt-0 pt-0"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setEditModalIsOpen(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <Table>
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" className="table-data">
                        {selectOrder.orderDetails}
                      </th>
                      <td className="table-data">
                        {selectOrder.shipment.fullName}
                      </td>
                      <td className="table-data">
                        {selectOrder.shipment.email}
                      </td>
                      <td className="table-data">
                        {selectOrder.shipment.mobileNumber}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <div className="form-group row my-5">
                  <label htmlFor="" className="col-2 mt-2 table-data">
                    Pickup Date:
                  </label>
                  <input
                    type="date"
                    defaultValue={formatDateForInput(selectOrder.shipment.getDate)}
                    min={formatDateForInput(new Date())}
                    ref={register({ required: true })}
                    name="getDate"
                    className="form-control modifyForm col-2"
                  />
                  <div className="col-2">
                    {errors.getDate && (
                      <span className="text-danger">
                        Pickup date must not empty ! <br />
                      </span>
                    )}
                  </div>

                  <label htmlFor="" className="col-2 mt-2 table-data">
                    Pickup Time:
                  </label>
                  {(() => {
                    const parts = parseTimeParts(selectOrder.shipment.getTime);
                    return (
                      <div className="d-flex col-4">
                        <select
                          name="getHour"
                          defaultValue={parts.hour || ''}
                          ref={register({ required: true })}
                          className="form-control col-4 mr-2"
                        >
                          <option value="">HH</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                            <option key={h} value={String(h)}>{String(h)}</option>
                          ))}
                        </select>
                        <select
                          name="getMin"
                          defaultValue={parts.min || '00'}
                          ref={register({ required: true })}
                          className="form-control col-4 mr-2"
                        >
                          <option value="00">00</option>
                          {Array.from({ length: 60 / 5 }, (_, i) => String(i * 5).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select
                          name="getAMPM"
                          defaultValue={parts.ampm || 'AM'}
                          ref={register({ required: true })}
                          className="form-control col-4"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    );
                  })()}
                  <div className="col-2">
                    {(errors.getHour || errors.getMin || errors.getAMPM) && (
                      <span className="text-danger">
                        Pickup time must not be empty ! <br />
                      </span>
                    )}
                  </div>
                </div>

                {formError && (
                  <div className="row">
                    <div className="col-12 text-center text-danger mb-3">{formError}</div>
                  </div>
                )}

                <div className="form-group text-center ">
                  <input
                    type="hidden"
                    value={selectOrder._id}
                    ref={register({ required: true })}
                    name="id"
                  />
                  <button
                    type="submit"
                    className="btn btn-amber px-5 table-data"
                  >
                    <FontAwesomeIcon icon={faCloudUploadAlt} /> Update
                  </button>
                </div>
              </form>

              <div className="d-flex justify-content-center mt-5">
                <h3 className="text-info">Order Details</h3>
              </div>

              <Table bordered className="ml-3 mr-3 mb-5">
                <thead className="mt-3">
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((item) => (
                    <tr key={item.id}>
                      <th scope="row">{(counter = counter + 1)}</th>
                      <td>{item.service}</td>
                      <td>{item.category}</td>
                      <td>{item.name}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="quantity px-3">
                            {item.quantity}
                          </span>
                          <button
                            className="ml-3 p-2 btn btn-danger text-white"
                            onClick={() => openDataDeleteModal(item)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal>

        <Modal toggle={() => setDeleteModal(false)} isOpen={deleteModal}>
          {selectOrder && (
            <div className="px-5 my-3 single-order">
              <form className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <button
                    type="button"
                    className="close mt-0 pt-0"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setDeleteModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title text-danger ml-4">
                    Are you sure to delete this product?
                  </h4>
                </div>
                <div className="form-group  ">
                  <input
                    type="hidden"
                    value={selectOrder._id}
                    ref={register({ required: true })}
                    name="id"
                  />

                  <div className="row d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-danger">
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AllOrders;
