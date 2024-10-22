import React from 'react';
import './Footer.css';
import facebook_icon from '../images/facebook_icon.png';
import twitter_icon from '../images/twitter_icon.png';
import instagram_icon from '../images/instagram_icon.png';
import logo from '../images/logo.png';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={logo} alt="" />
            <p>CuisineDash is a Food Delivery System created to help you in the time of hunger. Feel hungry just scroll, search, order and Serve yourself the great delicacies on the display. Enjoy MUNCHINGGGGGG!!!! </p>
            <div className="footer-social-icons">
                <img src={facebook_icon} alt="" />
                <img src={twitter_icon} alt="" />
                <img src={instagram_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-9865778545</li>
                <li>contact@cuisinedash.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © CuisineDash.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
