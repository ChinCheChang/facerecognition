import React from 'react';
import Facebox from '../Facebox/Facebox';

const FaceRecognition = ({ imageUrl, boxs}) => {
  return(
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' alt='img' src={ imageUrl } width='500px' height='auto'/>
        {
          boxs.map((value, index) => {
              return (
                <Facebox
                  key={index}
                  top={value.topRow}
                  right={value.rightCol}
                  bottom={value.bottomRow}
                  left={value.leftCol}
                />
              );
            }
          )
        }
      </div>
    </div>
  );
}

export default FaceRecognition;
