import { Toaster, toast } from 'sonner';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotifications } from '../../store/slices/notificationSlice';

const ToastNotification = ({ 
  position = 'top-center',
  richColors = true,
  theme = 'light',
  duration = 3000,
  closeButton = true,
  expand = false
}) => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach(notification => {
        if (notification.type === 'error') {
          toast.error(notification.message);
        } else if (notification.type === 'success') {
          toast.success(notification.message);
        } else if (notification.type === 'info') {
          toast.info(notification.message);
        } else if (notification.type === 'warning') {
          toast.warning(notification.message);
        } else {
          toast(notification.message);
        }
      });
      dispatch(clearNotifications());
    }
  }, [notifications, dispatch]);

  return (
    <Toaster
      position={position}
      richColors={richColors}
      theme={theme}
      duration={duration}
      closeButton={closeButton}
      expand={expand}
    />
  );
};

ToastNotification.propTypes = {
  position: PropTypes.oneOf([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ]),
  richColors: PropTypes.bool,
  theme: PropTypes.oneOf(['light', 'dark']),
  duration: PropTypes.number,
  closeButton: PropTypes.bool,
  expand: PropTypes.bool
};

export default ToastNotification;