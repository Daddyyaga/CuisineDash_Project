import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Assuming you have some custom styling

function Login() {
  const { handleLogin, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
      setError(null);
      toast.success(`Login successful: Welcome ${username}!`);
      setShowPopup(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExplore = () => {
    setShowPopup(false);
    navigate('/restaurants');
  };

  const handleAdminDashboard = () => {
    setShowPopup(false);
    navigate('/admin');
  };

  return (
    <div className="login d-flex align-items-center justify-content-center min-vh-70"> {/* Adjusted min-vh */}
      {user ? (
        <div className="text-center">
          <h2>Welcome, {user.username}!</h2>
          <p>You are currently logged in!</p>
        </div>
      ) : (
        <>
          <div className="card shadow-lg p-4 bg-white rounded" style={{ width: '400px' }}>
            <h2 className="text-center mb-4">Login</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </>
      )}

      <ToastContainer />

      {showPopup && (
        <div className="popup d-flex align-items-center justify-content-center">
          <div className="popup-content p-4 text-center bg-white rounded shadow-lg">
            <h3>Welcome, {username}!</h3>
            {user.role === 'Admin' ? (
              <>
                <p>You have logged in as an Admin.</p>
                <button onClick={handleAdminDashboard} className="btn btn-success mt-3">
                  Go to Admin Dashboard
                </button>
              </>
            ) : (
              <>
                <p>Enjoy ordering your favorite food!</p>
                <button onClick={handleExplore} className="btn btn-success mt-3">
                  Let's Explore
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
