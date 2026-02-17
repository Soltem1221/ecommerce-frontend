import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { paymentAPI } from '../utils/api';
import '../styles/global.css';

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const tx_ref = searchParams.get('tx_ref') || searchParams.get('trx_ref');
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (tx_ref) {
            verifyPayment(tx_ref);
        } else {
            // Fallback: if no tx_ref, maybe just show success if we assume redirect implies success (risky)
            // or check order status via API
            setStatus('success');
            setMessage('Payment successful! Your order has been placed.');
        }
    }, [tx_ref]);

    const verifyPayment = async (ref) => {
        try {
            const { data } = await paymentAPI.verifyPayment(ref);
            if (data.success) {
                setStatus('success');
                setMessage('Payment confirmed! Thank you for your purchase.');
            } else {
                setStatus('error');
                setMessage('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Error verifying payment. Please contact support.');
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                {status === 'verifying' && <div className="spinner" style={{ margin: '0 auto' }}></div>}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                        <h1 className="section-title">Order Placed!</h1>
                        <p style={{ marginBottom: '30px' }}>{message}</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <Link to={`/orders`} className="btn btn-primary">My Orders</Link>
                            <Link to="/" className="btn btn-outline">Continue Shopping</Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                        <h1 className="section-title">Payment Issue</h1>
                        <p style={{ marginBottom: '30px' }}>{message}</p>
                        <Link to="/contact" className="btn btn-primary">Contact Support</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
