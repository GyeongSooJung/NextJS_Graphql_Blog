import REACT, { useState } from 'react';
import DaumPostCode from 'react-daum-postcode';

import {
  Paper,
  Typography
  } from '@material-ui/core';


export default function Addresspage(props) {

    const [addressOn,setAddressOn] = useState(true);
    const [address,setAddress] = useState('');


    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType == 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        //fullAddress -> 전체 주소반환
        setAddress(fullAddress);
        setAddressOn(false);
    };


    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
           {(addressOn === true) ? <DaumPostCode onComplete={handleComplete} className="post-code"/> : 
           <Typography>{address}</Typography> }

        </Paper>
    )
}