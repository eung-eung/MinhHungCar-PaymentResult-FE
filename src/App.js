import { useEffect, useState } from "react";
import "./App.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const getParam = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(key);
    return myParam;
};
const getPaymentResult = async () => {
    const responseCode = getParam("vnp_ResponseCode");
    const ref = getParam("vnp_TxnRef")
    // return responseCode === "00" ? true : false;
};
const showSwal = (status) => {
    console.log(status);

    withReactContent(Swal)
        .fire({
            title: status ? "Thanh toán thành công!" : "Thanh toán thất bại",
            icon: status ? "success" : "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        })
        .then((res) => {
            if (res.isConfirmed) {
                window.postMessage("success");
            } else {
                window.postMessage("failed")
            }
        });
};
let timer
function App() {
    const MySwal = withReactContent(Swal);
    const [orderInfo, setOrderInfo] = useState(getParam('vnp_OrderInfo'))
    const [txnRef, setTxnRef] = useState(getParam("vnp_TxnRef"))
    const [count, setCount] = useState(0)
    const [isPaid, setIsPaid] = useState(undefined)

    const getStatusPayment = async () => {
        return await fetch(`https://minhhungcar.xyz/payment_status?vnp_OrderInfo=${orderInfo}&vnp_TxnRef=${txnRef}`).then(res => res.json())
    }

    useEffect(() => {
        timer = setInterval(async () => {
            const p = (await getStatusPayment()).data.status
            if (p === 'paid') {
                clearInterval(timer)
                setIsPaid(true)
            } else {
                setCount((prev) => {
                    if (prev >= 3) {
                        clearInterval(timer)
                        setIsPaid(false);
                    }
                    return ++prev
                })
            }

        }, 1000)
        return () => clearInterval(timer)
    }, []);

    return (
        <div className="container">
            {isPaid ? 'aaaa' : 'false'}
            {isPaid === undefined ? (
                <>
                    <span className="loader"></span>
                </>
            ) : showSwal(isPaid)}
        </div>
    );
}

export default App;
