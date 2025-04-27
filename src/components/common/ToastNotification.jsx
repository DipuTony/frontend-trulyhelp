import { Toaster } from 'sonner';
import PropTypes from 'prop-types';

const ToastNotification = ({ 
  position = 'top-center',
  richColors = true,
  theme = 'light',
  duration = 3000,
  closeButton = true,
  expand = false
}) => {
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