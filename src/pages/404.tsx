import React from 'react';
import Router from 'next/router';

const NotFound: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px', color: '#333' }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => Router.push('/')}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3';
        }}
        onMouseOut={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;

