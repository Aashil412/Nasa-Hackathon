import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryTab = (props) => {
  const navigate = useNavigate()
  function handleClick(language) {
    console.log('goto game')
    navigate(`/game/${language}`)
  }
  return (
    <div className='category-tab' onClick={()=> {handleClick(props.language)}}>
      <span className='category-img'>{props.img}</span>
      <span className='category-text'>{props.text}</span>
    </div>
  )
}

export default CategoryTab;