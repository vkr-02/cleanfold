import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Modal } from "reactstrap";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const CheckoutForm = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    // Simulating payment processing logic
    setTimeout(() => {
        setIsProcessing(false);
        onPaymentSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="p-3 mb-4 bg-white rounded shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
        <CardElement options={{
            style: {
                base: {
                    fontSize: '17px',
                    color: '#1e293b',
                    '::placeholder': { color: '#94a3b8' },
                },
                invalid: { color: '#ef4444' },
            },
        }}/>
      </div>
      <Button 
        color="danger" 
        className="w-100 rounded-pill font-weight-bold" 
        style={{height: '50px', fontSize: '18px', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'}}
        type="submit" 
        disabled={isProcessing}
      >
        {isProcessing ? "Processing Securely..." : `Pay ₹ ${amount} Now`}
      </Button>
    </form>
  );
};

export default function StripeCheckoutModal({ isOpen, toggle, amount, onPaymentSuccess }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
        <div className="modal-header text-white border-0" style={{backgroundColor: '#1a1e29'}}>
            <h5 className="mb-0 font-weight-bold"><i className="now-ui-icons business_money-coins mr-2 text-danger"></i>Secure Online Payment</h5>
            <button className="close text-white" onClick={toggle}>&times;</button>
        </div>
        <div className="modal-body" style={{backgroundColor: '#f8fafc'}}>
            <p className="text-center text-secondary mb-2 mt-2 font-weight-bold">Supports Google Pay, Apple Pay & Cards</p>
            <p className="text-center text-muted small px-4 mb-4">Your payment information is securely processed by Stripe. We never store your card details.</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} onPaymentSuccess={onPaymentSuccess} />
            </Elements>
        </div>
    </Modal>
  );
}
