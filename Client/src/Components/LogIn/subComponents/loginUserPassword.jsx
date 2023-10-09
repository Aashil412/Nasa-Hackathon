import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Form } from "react-bootstrap";
import '../LoginStyles.css'
import SignupComponent from "./signupComponent";
import { useAuth } from "../../../context/auth/AuthContext";

const LoginUserPassword = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const {successfulSignup, setSignup} = useAuth();

  useEffect(()=> {
    if (successfulSignup) {
      setTimeout(()=>setSignup(false), 5000)
    }
  }, [successfulSignup])


  const navigate = useNavigate()
  const authContext = useAuth()

  function handleEmailChange(event) {
    console.log(event.target.value)
    setEmail(event.target.value)
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
  }

  async function handleSubmit() {
    if (await authContext.login(email, password)) {
      props.closeForm();
    } else {
      setShowErrorMessage(true)
    }
  }
    return (
      <div>
        {showErrorMessage && (
        <div className="errorMessage alert bg-danger text-white" style={{ fontSize: '15px', textAlign: 'center', margin: '10px' }}>
          Authentication Failed. Check credentials or refresh the page
        </div>
      )}

        {/* {successfulSignup && (
        <div className="errorMessage alert bg-success text-white" style={{ fontSize: '15px', textAlign: 'center', margin: '10px' }}>
          Successful Signup
        </div>
        )} */}
      <Form className="form-container">
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Form.Group controlId="email" className="form-group">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="email"
          />
        </Form.Group>

        <Form.Group controlId="password" className="form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
        </Form.Group>
        <div className="form-group">
          <a className="forgot-link" href="/">Forgot Password?</a>
        </div>
        </div>
        <div className="button-align">
          <Button onClick={handleSubmit} className="login-button">
            Login
          </Button>

          <div className="bottom-line">
            <span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>Not a member?<span className="lines">&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;</span>
          </div>
        </div>
        <div className="join-text"><b className="join-link" onClick={()=>{props.changeComp(<SignupComponent changeComp={props.changeComp} closeForm={props.closeForm}/>, 'SignupComponent')}}>Join</b> to unlock the best of OS Science.</div>

      </Form>
      </div>

    )
}

export default LoginUserPassword;