import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200 text-center px-4">
      <h1 className="text-6xl font-bold text-error">404</h1>
      <p className="text-xl mt-4 text-base-content">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn btn-primary mt-6"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
