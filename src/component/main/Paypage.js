import REACT, { useState, useEffect } from 'react';

import {
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
  } from '@material-ui/core';


export default function Paypage(props) {

    const [amount, setAmount] = useState(0);
    const [name, setName] = useState('')

    useEffect(()=> {  // 아임포트에 필요한 jquery 연결
        const jquery = document.createElement('script');
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.8.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        }
    },[])

    function onClickPayment() {

         /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init('imp53564537');

        /* 2. 결제 데이터 정의하기 */
        const data = {
        pg: 'inicis',                           // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
        amount: amount,                                 // 결제금액
        name: name,                  // 주문명
        buyer_name: '홍길동',                           // 구매자 이름
        buyer_tel: '01012341234',                     // 구매자 전화번호
        buyer_email: 'example@example',               // 구매자 이메일
        buyer_addr: '신사동 661-16',                    // 구매자 주소
        buyer_postcode: '06018'                      // 구매자 우편번호
        };

        /* 4. 결제 창 호출하기 */
        IMP.request_pay(data, callback);
    }

    /* 3. 콜백 함수 정의하기 */
    function callback(response) {
        const {
        success,
        merchant_uid,
        error_msg
        } = response;

        if (success) {
        alert('결제 성공');
        } else {
        alert(`결제 실패: ${error_msg}`);
        }
    }

    function PayHandler(e) {
        if(e.target.value === '연필') {
            setName('연필');
            setAmount(1000);
        }
        else if(e.target.value === '지우개') {
            setName('지우개');
            setAmount(5000);
        }
        else {
            setName('볼펜');
            setAmount(10000);
        }
    }

    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">상품</FormLabel>
                    <RadioGroup row aria-label="position" name="position" defaultValue="a" onChange={PayHandler}>
                        <FormControlLabel
                        value="연필"
                        control={<Radio color="primary" />}
                        label="연필 1000원"
                        labelPlacement="top"
                        />
                        <FormControlLabel
                        value="지우개"
                        control={<Radio color="primary" />}
                        label="지우개 5000원"
                        labelPlacement="top"
                        />
                        <FormControlLabel
                        value="볼펜"
                        control={<Radio color="primary" />}
                        label="볼펜 10000원"
                        labelPlacement="top"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                <Button onClick={onClickPayment} variant="contained" color="primary">결제하기</Button>
            </div>
        </Paper>
    )
}