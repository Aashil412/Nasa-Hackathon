import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import './LoginStyles.css'
import LoginOptions from "./subComponents/loginOptionsComponent"
import SignupComponent from "./subComponents/signupComponent"
import LoginUserPassword from "./subComponents/loginUserPassword"


const LoginComponent = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [component, setComponent] = useState(<LoginUserPassword changeComp={changeComponent} closeForm={props.closeForm}/>)
  const [componentType, setComponentType] = useState('LoginUserPassword')

  useEffect(() => {
    console.log("not null", props.switchSignup)
    if (props.switchSignup) {
      setComponent(<SignupComponent changeComp={changeComponent} closeForm={props.closeForm}/>);
      setComponentType('SignupComponent')
    }

}, []);

  const navigate = useNavigate()
  function changeComponent(newComponent, type) {
    setComponent(newComponent)
    setComponentType(type)
  }
  function handleUsernameChange(event) {
    setUsername(event.target.value)
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
  }

  async function handleSubmit() {
    if (await authContext.login(username, password)) {
      navigate(`/welcome/${username}`)
    } else {
      setShowErrorMessage(true)
    }
  }

  return (
    <div className="Login">
      <h1 className="close-button" onClick={props.closeForm}>
        &#x2715;
      </h1>
      {(componentType == 'LoginUserPassword' ||componentType == 'SignupComponent') ? <h1 className="back-button" onClick={()=> {changeComponent(<LoginOptions changeComp={changeComponent} closeForm={props.closeForm}/>, 'LoginOptions')}}>&#x2039;</h1> : ''}
      <div style={{margin: '10px'}}></div>
      {/* <img src={TripLogo} alt="Trip Advisor Logo" className="svg-logo" /> */}
      {component}
    </div>
  )
}

export default LoginComponent