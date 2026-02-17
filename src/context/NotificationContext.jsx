import { createContext, useState, useContext, useCallback } from 'react';

export const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        style={{
                            padding: '16px 24px',
                            borderRadius: '8px',
                            background: n.type === 'success' ? 'var(--success)' :
                                n.type === 'error' ? 'var(--danger)' :
                                    n.type === 'warning' ? 'var(--warning)' : 'var(--primary)',
                            color: 'white',
                            boxShadow: 'var(--shadow-lg)',
                            animation: 'slideIn 0.3s ease-out forwards',
                            minWidth: '250px',
                            maxWidth: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px'
                        }}
                    >
                        <span>{n.message}</span>
                        <button
                            onClick={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))}
                            style={{ background: 'none', color: 'white', fontSize: '18px', padding: '0 4px', opacity: 0.8 }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <style>
                {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
            </style>
        </NotificationContext.Provider>
    );
};
