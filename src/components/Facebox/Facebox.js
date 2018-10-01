import React from 'react';
import './Facebox.css';

const Facebox = ({top, right,bottom, left}) => {
  return(
    <div
      className='bounding_box'
      style={{top: top, right: right, bottom: bottom, left: left}}
    />
  )
}

export default Facebox;
