import React from 'react';

function ErrorMessage({ error }) {
  return (
    <div className="error">
      <p className="error-header">Oops!</p>
      <p>{error}</p>
    </div>
  );
}

export default ErrorMessage;