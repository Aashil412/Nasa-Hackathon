import React, { useEffect, useRef, useState } from 'react';
// import tripLogo from '../../images/tripLogo.png'
// import { useNavigate } from "react-router-dom"
// import LoginComponent from '../loginComponent/LoginComponent'
import { Button, Col, Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import './NavbarStyles.css'
import { useNavigate } from 'react-router-dom';
// import { useTheme } from '../../contexts/theme/ThemeContext';
// import LoginComponent from '../Login/Login';
// import SignupComponent from '../Login/subComponents/signupComponent';
// import { useAuth } from '../../contexts/auth/AuthContext';
// import { useAuth } from '../auth/AuthContext';
// import LoginOptions from '../loginComponent/subComponents/LoginOptionsComponent';


const overlayStyles = {
  'position': 'fixed',
  'top': 0,
  'left': 0,
  'width': '100%',
  'height': '100%',
  'backgroundColor': 'rgba(0, 0, 0, 0.25)', // Adjust the opacity (0.5 in this case) to control transparency
  'zIndex': 1000, // Set a higher z-index to ensure it appears above other elements
};


const NavigationBar = (props) => {
  // const { theme, toggleTheme }= useTheme();
  const navigate = useNavigate()
  // const authContext = useAuth()
  const [pageTitle, setPageTitle] = useState("")
  const [signupComp, setSignupComp] = useState(false)
  // const navigate = useNavigate();
  // const {username, token, logout} = useAuth();
  const token = false;


  const overlayStyles = {
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'width': '100%',
    'height': '100%',
    'zIndex': 1000, // Set a higher z-index to ensure it appears above other elements
  };


  return (
    <div>
      {props.formIsOpen && <div className='form-opacity' style={overlayStyles} onClick={props.closeorOpenForm}/>}
      {(props.formIsOpen) && <LoginComponent closeForm={props.closeorOpenForm} switchSignup={signupComp} />}
      <Navbar collapseOnSelect expand="lg" bg="white" variant="white" className='nav-head'>
        <Container>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFOUlEQVR4nO3Xe0xTVxwH8LosWbJ/tn+27J/9t8df2z9sS5aYEAsiugIqCogGRawoYWwsw1SJFmrHymxrxBfSggOELswXbsOoG5AKvYU+KLS0pW14KCLUR2ntA6X2u9xLLVSZ9AFqFk/yTZr23tPP/Z17zrmXRvvfNmAZ61TnlwclGpGgWd92pMWkONpiNlW0mAfIz4KL+jZug6ZqX2XHFy8cxm5Q7RReMKglCqujbdQL6TjmTeuoF40Kq0NwwaDmNelyyXOX1Maq7fqEd1YrP6+d9PwXSjpP9JPAQy/QrrcOs0Syj5YEx/5VmXD0ssnUPuYLGSb1x+UF1e5MAe2mSRtX0puyqLjSOlWSqP3G7XBhUn/1yOacBkZcM+m66XRzm3q+WRQcOSQVf5ktkeCk44DbC0z7gJvuWSCZ1oH7tiJx96fR6YBlvHNaeSTDKh0HjP7qjXuCccNOQH3PB16TVh7VxDlQq2Se1066oqme/VEwzuwACOvM7+f7Jt0lZ9Q5EVePXEoixRnJmfsYuDEHp7MB1yeCjzt0Qa+OyLdPJPtKorTaIwW6poEx/9AOOgHF3fmPkygmHCyRPCZs4E8Sjeh5i/DcXBmagqDZAFYVQeXYJQMsVjeFG3AAnU9V7enFnCvRVIYNJLevUHH7RHL8eKIjKMViOWSjUyFdIL9Z3xoWDmz2G8fP9Q6E0rmg2UCBykvr0cpYT6Wcc4b6TthsDAl44myPpS029s0FYW2xse8SdPp3Mjp9UCyRhdQ5q4qgMCSMiIuj8g9jHfXdXhERUh+ixk4QdPotIi6uRJqY+N4zMPmKFTEyOv2UjE53PfkTcWNn1EBWiEBxQ0fgXIJOnyLi4pqI+PjlAaAyKQlKBmP2IBJY83dInQsu+oeYc4aCkeEdbAhriMXV14L+uyclBSoGAwHgQG4uHlRVYbCwEL0ZGehavRo1FedC6vz6iJuaEE9Pkr1iOa4OPQypj5ojv6N7zRroMjJgYTJhLyuDeceOYKCnvj4QW0UFtIVFUHF46LzaDentZ7e6jgnA6PBvXfencPxPI3XPkSErFwqOaLoMTW4ejNnbcXf/fngOHw7kucAncdfV4TZfgP4DHCgEx3FdM0p1rLgzs/iOuGYWY/JxKpRKURcmM0D1wx70b8vGWFER3AJBECws4Nw4q6sxwi1DfykXxrrfMDRup4DkdkZua89F9VvRXcqDNoeJ4YICOMvL50VFBZwbe2Ulhko5MB/kYuzKNUhHp5+FjT2GvLIefcxcWHbtwiSXuyBq0YCB1NXBKhRCX8yG6pcj6JCb0HGxHT1538KYswMTxcXwCIVhwRYXWD8b1+nTuFn2MwxZWXDx+RGhlhTo8WcoPz9q3Gug53UF61/fgwh3kvhe6Vms27p1jFzHXhWgi89Hf2amd/Z5MD7+s9709Gojk6mb4PE85A7xMoD32GyYcnIe9m3ceKs7IWH7vO8iqnXrknWbN1+y5OdbbMeO+ZYaaC8rw+Du3V5derpNkZRUo4yJeXuBN5NAVd/p2bDhe11WVvvwnj1Wp0i0aEDnoUO4UVjo02/Z8kC9dq2UiI//mBZN605I+FCdlibQb9umvlVS4nDX1oYNdAuF5MODz5id7dGkploIOn0lbSmaatWqr/s2bWocyM013OHzpxcC2jgcmHfufKRNS5tQMhgc0Ghv0F5Ea0lMfEuZkpKpy8r6w1JQMGw/eTIAfMDjYSgv73F/ZqZNmZx8VrNy5fu0l9m6YmM/0KSmluuzs7vUycnu3vXr5cTy5Z+/VNSLav8CqP0gmBDSVvUAAAAASUVORK5CYII="></img>
          <span className='nav-bar-title' onClick={()=> {navigate('/')}}>&#xa0; OS Connect</span>
        {/* <Navbar.Brand href="#home" className="d-flex justify-content-left m-2 svg-NavLogo"><img src={tripLogo} alt="Trip Advisor Logo" className="svg-home-logo" /> </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <span className='right-sided-links'>
          <Nav>
          {token ?
          <>
            <Nav.Link className='nav-link-style' onClick={()=>{navigate('/profile')}}>
              &#xa0;Hello {username}
            </Nav.Link>

            <Nav.Link className='nav-link-style' onClick={logout}>
              &#xa0;logout
            </Nav.Link>
          </>
          :
          <>
          <Nav.Link className='nav-link-style' onClick={()=>{props.closeorOpenForm(); setSignupComp(true) }}>
            &#xa0;signup
          </Nav.Link>
          <Nav.Link className='nav-link-style' onClick={()=> {props.closeorOpenForm(); setSignupComp(false)}}>
            &#xa0;login
          </Nav.Link>
          </>
        }
          {/* for now theme is inactive. */}
          </Nav>
          </span>

        </Navbar.Collapse>
        </Container>
    </Navbar>
</div>
  );
}

export default NavigationBar;