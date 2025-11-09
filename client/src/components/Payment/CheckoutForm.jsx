import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent } from '../../redux/slices/paymentSlice';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { clientSecret, isLoading, error } = useSelector((state) => state.payment);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setPaymentError(error.message);
      setPaymentSuccess(false);
    } else {
      setPaymentError(null);
      setPaymentSuccess(true);
      // Handle successful payment (e.g., update registration status)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <CardElement className="p-4 border rounded-lg" />
      </div>
      {paymentError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{paymentError}</div>}
      {paymentSuccess && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">Payment successful!</div>}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
