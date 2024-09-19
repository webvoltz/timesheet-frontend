import { notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONST } from "../../constants/route-constant";
import { setLocalStorageItem } from "../../utils/local-storage";
import Login from "./login";
import OtpVerification from "./otpVerification";

export default function Authentication() {
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState({ userName: "", password: "" });
    const [temporaryToken, setTemporaryToken] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleStorage = () => {
        setLocalStorageItem("token", "token");
        setLocalStorageItem("ref_token", "ref_token");
        setLocalStorageItem("last_login_time", `${new Date()}`);
        setLocalStorageItem("remeber_me", `${rememberMe}`);
        navigate(`${ROUTE_CONST.INITIAL_ROUTE}`);
    };
    const loginSubmision = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        notification.success({ message: "Otp is send succesfully" });
    };

    const handleSubmit = async () => {
        setTemporaryToken("temptoken");
    };

    const handleOtpSubmit = async (otp: string) => {
        if (otp && otp.length === 6) {
            handleStorage();
        } else {
            notification.error({ message: "Otp is required" });
        }
    };

    return (
        <div className="w-full mx-auto flex items-center h-screen login">
            {temporaryToken ? (
                <OtpVerification handleOtpSubmit={handleOtpSubmit} isLoading={false} resentOtp={loginSubmision} />
            ) : (
                <Login
                    userDetail={userDetail}
                    setUserDetail={setUserDetail}
                    handleSubmit={handleSubmit}
                    isLoading={false}
                    remeberMe={rememberMe}
                    setRememberMe={setRememberMe}
                />
            )}
        </div>
    );
}
