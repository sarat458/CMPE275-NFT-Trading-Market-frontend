/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import {
  Navigate, Route, Routes, useNavigate,
} from 'react-router-dom';
import './App.css';
import {
  useState, useEffect, createContext,
} from 'react';
import { gapi } from 'gapi-script';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import SystemDashboard from './pages/Dashboard/SystemDashboard';
import NftCollection from './pages/NftCollection/NftCollection';
import Cart from './pages/Cart/Cart';
import PersonalStats from './pages/PersonalStats/PersonalStats';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import NftSale from './pages/NftSale/NftSale';
import CLIENT_ID from './config';
import EmailVerification from './pages/EmailVerification/EmailVerification';
import UserWallet from './pages/UserWallet/UserWallet';
import VerificationLink from './pages/EmailVerification/VerificationLink';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NotFound from './components/NotFound/NotFound';
import { googleLogIn } from './api/AuthRequest';
import Profile from './pages/Profile/Profile';

const Context = createContext(null);

function App() {
  const [token, setToken] = useState(
    localStorage.getItem('access-token') ? localStorage.getItem('access-token') : null
  );
  const [userObj, setUserObj] = useState(null);
  const [googleUserObj, setGoogleUserObj] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        CLIENT_ID,
        scope: 'fetch_basic_profile',
      });
    };
    gapi.load('client:auth2', initClient);
  });

  const onSuccess = (res) => {
    // console.log('success:', res);
    googleLogIn(res.tokenObj.id_token).then((response) => {
      console.log(response);
      localStorage.setItem('auth', 'google');
      const isVerified = response.data.enabled;
      if (isVerified) {
        setGoogleUserObj(res);
        setUserObj(response.data);
        localStorage.setItem('access-token', res.tokenObj.access_token);
        localStorage.setItem('userObj', JSON.stringify(response.data));
        localStorage.setItem('googleUserObj', JSON.stringify(res));
        localStorage.setItem('nickName', response.data.nickname);
        localStorage.setItem('id', response.data.id);
        setToken(res.tokenObj.access_token);
        navigate('/user');
      }

      if (!isVerified) {
        navigate('/account/activation');
      }
    }).catch((err) => {
      alert('Failed to login.');
      // navigate('/account/activation');
    });
  };
  const onFailure = (err) => {
    console.log('failed:', err);
    setUserObj(null);
    setToken(null);
    navigate('/');
  };

  const logoutUser = () => {
    console.log(`Before logout -->${token}`);
    setToken(null);
    localStorage.removeItem('access-token');
    // useNavigate('/');
    console.log(`After logout -->${token}`);
  };

  return (
    <Context.Provider value={setToken}>
      <div>
        <Routes>
          <Route path="/account/activation" element={<EmailVerification />} />
          <Route path="/account/verify/:token" element={<VerificationLink />} />
          <Route path="/" element={<Login clientId={CLIENT_ID} onSuccess={onSuccess} onFailure={onFailure} />} />
          <Route path="/user" element={<Navbar />}>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="collection" element={<NftCollection />} />
              <Route path="nftsale" element={<NftSale />} />
              <Route path="personalstats" element={<PersonalStats />} />
              <Route path="dashboard" element={<SystemDashboard />} />
              {/* <Route path="cart" element={<Cart />} /> */}
              <Route path="wallet" element={<UserWallet />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

export default App;
