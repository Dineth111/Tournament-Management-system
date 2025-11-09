import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../redux/slices/notificationSlice';

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-md mb-4 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="ml-4 font-bold"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
