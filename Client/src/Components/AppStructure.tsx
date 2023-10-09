import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { ReactNode, useState } from 'react'
import NavigationBar from './NavBar/NavBarComponent';
import WelcomeComponent from './Welcome/Welcome';
import Profile from './Profile/Profile';

import ChatBox from './ChatBox/ChatBox';

import CreateProject from './CreateProject';
import AuthProvider from '../context/auth/AuthContext';

interface elementProp {
}

const AppStructure = () => {
    const [componentType, setComponentType] = useState('LoginOption')
    const [signup, setSignup] = useState(false)

    function changeComponent(newComponent, type) {
        // setComponent(newComponent)
        setComponentType(type)
      }
    
    function closeComp() {
        setSignup(!signup);
    }

    return (
        <div className=''>
        {/* <AuthProvider> */}
            <BrowserRouter>
            <AuthProvider>
                 <NavigationBar changeComp={changeComponent} closeorOpenForm={closeComp} formIsOpen={signup}/>
                <Routes>
                        <Route path='' element={<WelcomeComponent/>}/>
                        <Route path='/profile' element={<Profile/>}/>
                        <Route path='/chat' element={<ChatBox/>}/>

                    <Route path='/profile' element={<Profile />} />
                    <Route path='/createProject' element={<CreateProject/> } />

                        {/* <Route path='/signup' element={<SignupComponent changeComp={changeComponent} closeForm={closeComp}/>}/> */}
                </Routes>
                {/* <FooterComponent/> */}
            </AuthProvider>
            </BrowserRouter>
        {/* </AuthProvider> */}
        </div>
    )
}

export default AppStructure;