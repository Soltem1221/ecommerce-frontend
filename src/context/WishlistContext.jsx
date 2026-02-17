import { createContext, useState, useEffect, useContext } from 'react';
import { wishlistAPI } from '../utils/api';
import { AuthContext } from './AuthContext';
import { NotificationContext } from './NotificationContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (user) {
            loadWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const { data } = await wishlistAPI.getWishlist();
            setWishlist(data.wishlist || []);
        } catch (err) {
            console.error('Failed to load wishlist', err);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            await wishlistAPI.add({ productId });
            await loadWishlist();
            showNotification('Success', 'Product added to wishlist', 'success');
        } catch (err) {
            showNotification('Error', 'Failed to add to wishlist', 'error');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
            showNotification('Success', 'Product removed from wishlist', 'success');
        } catch (err) {
            showNotification('Error', 'Failed to remove from wishlist', 'error');
        }
    };

    const toggleWishlist = async (productId) => {
        const item = wishlist.find(i => i.product_id === productId);
        if (item) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product_id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            loadWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
