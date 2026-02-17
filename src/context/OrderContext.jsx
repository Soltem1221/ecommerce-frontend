import { createContext, useState, useEffect, useContext } from 'react';
import { orderAPI } from '../utils/api';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await orderAPI.getOrders();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user]);

    return (
        <OrderContext.Provider value={{ orders, ordersCount: orders.length, loading, fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
