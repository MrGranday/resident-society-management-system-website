import React from 'react';
import PropTypes from 'prop-types';

export default function Popup({ message, isError }) {
  console.log('Rendering Popup:', { message, isError });
  return (
    <div className={`popup ${isError ? 'error' : ''}`}>
      {message}
    </div>
  );
}

Popup.propTypes = {
  message: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
};