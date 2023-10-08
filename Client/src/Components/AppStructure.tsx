import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import { ReactNode, useState } from 'react'
import NavigationBar from './NavBar/NavBarComponent';
import WelcomeComponent from './Welcome/Welcome';
import Profile from './Profile/Profile';

import ChatBox from './ChatBox/ChatBox';

import Login from './LogIn/LogIn';
import SignIn from './SignIn/SignIn'

interface elementProp {
}

const AppStructure = () => {

    return (
        <div className=''>
        {/* <AuthProvider> */}
            <BrowserRouter>
            {/* <AuthProvider> */}
                <NavigationBar/>
                <Routes>
                        <Route path='' element={<WelcomeComponent/>}/>
                        <Route path='/profile' element={<Profile/>}/>
                        <Route path='/chat' element={<ChatBox/>}/>

                    <Route path='/profile' element={<Profile />} />
                    <Route path='/login' element={<Login/> } />
                    <Route path='/signin' element={<SignIn/> } />

                        {/* <Route path='/signup' element={<SignupComponent changeComp={changeComponent} closeForm={closeComp}/>}/> */}
                </Routes>
                {/* <FooterComponent/> */}
            {/* </AuthProvider> */}
            </BrowserRouter>
        {/* </AuthProvider> */}
        </div>
    )
}

export default AppStructure;