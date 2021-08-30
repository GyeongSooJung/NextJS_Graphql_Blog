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

import Image from 'next/image';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  Griditem: {
    margin : '0 50px',
    padding : '10px'
  },
}));


export default function Paypage(props) {
    const classes = useStyles();
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
        if(e.target.value === '티셔츠') {
            setName('티셔츠');
            setAmount(10000);
        }
        else if(e.target.value === '셔츠') {
            setName('셔츠');
            setAmount(25000);
        }
        else {
            setName('바지');
            setAmount(30000);
        }
    }

    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
            <Grid container>
                <Grid container justifyContent='center' spacing={4}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" align='center'>상품</FormLabel>
                        <RadioGroup row aria-label="position" name="position" defaultValue="a" onChange={PayHandler}>
                        <Grid className={classes.Griditem} item>
                            <Image
                            src='/images/티.jpg'
                            width='100px'
                            height='100px'
                            />
                            <FormControlLabel
                            value="티셔츠"
                            control={<Radio color="primary" />}
                            label={"티셔츠 10000원"}
                            labelPlacement="top"
                            />
                        </Grid>
                        <Grid className={classes.Griditem} item>
                            <Image
                            src='/images/셔츠.jpg'
                            width='100px'
                            height='100px'
                            />
                            <FormControlLabel
                            value="셔츠"
                            control={<Radio color="primary" />}
                            label="셔츠 25000원"
                            labelPlacement="top"
                            />
                        </Grid>
                        <Grid className={classes.Griditem} item>
                            <Image
                            src='/images/바지.jpg'
                            width='100px'
                            height='100px'
                            />
                            <FormControlLabel
                            value="바지"
                            control={<Radio color="primary" />}
                            label="바지 30000원"
                            labelPlacement="top"
                            />
                        </Grid>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid container justifyContent='center'>
                    <Button onClick={onClickPayment} variant="contained" color="primary">결제하기</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}