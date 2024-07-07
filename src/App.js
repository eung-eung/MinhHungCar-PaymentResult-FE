import { useEffect, useState } from "react";
import "./App.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const getParam = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(key);
    return myParam;
};
const getPaymentResult = () => {
    const responseCode = getParam("vnp_ResponseCode");

    return responseCode === "00" ? true : false;
};
const showSwal = (status) => {
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
function App() {
    const MySwal = withReactContent(Swal);
    const [result, setResult] = useState("loading");
    useEffect(() => {
        setTimeout(() => {
            setResult(getPaymentResult());
        }, 1000);
    }, []);
    return (
        <div className="container">
            {result === "loading" && (
                <>
                    <span className="loader"></span>
                </>
            )}
            {result !== "loading" && showSwal(result)}
        </div>
    );
}

export default App;
