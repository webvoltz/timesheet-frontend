import type { InputRef } from "antd";
import { Button, Card, Form, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import icon from "../../assets/images/otp_icon.png";

interface OtpVerificationProps {
    handleOtpSubmit: (otp: string) => void;
    isLoading: boolean;
    resentOtp: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ handleOtpSubmit, isLoading, resentOtp }) => {
    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef<(InputRef | null)[]>([]);
    const isPasting = useRef(false); // flag to track paste events

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (isPasting.current) {
            isPasting.current = false; // reset the flag after handling paste
            return;
        }
        const value = e.target.value;
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === OTP_LENGTH) handleOtpSubmit(combinedOtp);
        if (value && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault(); // prevent default paste behavior
        const pasteData = e.clipboardData.getData("text").trim();
        if (pasteData.length === OTP_LENGTH && !isNaN(Number(pasteData))) {
            const newOtp = pasteData.split("");
            setOtp(newOtp);
            handleOtpSubmit(newOtp.join(""));
        }
        isPasting.current = true; // set the flag during paste event
    };

    const handleClick = (index: number) => {
        inputRefs.current[index]?.setSelectionRange(1, 1);
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="max-w-sm mx-auto w-full px-3">
            <Card className=" bg-white rounded-lg border-gray-200 border shadow-md p-1.5">
                <Form className="flex  flex-col gap-4 items-center" onFinish={() => handleOtpSubmit(otp.join(""))}>
                    <img src={icon} alt="Logo" />
                    <h2 className="text-center text-2xl font-bold text-text-color"> OTP Verification</h2>
                    <p className="text-sm text-[#111928]">We have sent an OTP to your registered email</p>
                    <div className="w-full flex justify-between otpinput">
                        {otp.map((value, index) => (
                            <Input
                                key={value}
                                type="text"
                                ref={(input) => (inputRefs.current[index] = input)}
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onClick={() => handleClick(index)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-[45px]  rounded border-[#D1D5DB]"
                                onPaste={handlePaste}
                                placeholder="-"
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm">
                            <label className="text-gray-600 dark:text-gray-600">Didn’t receive?</label>
                        </div>
                        <button
                            className="text-sm font-medium text-primary hover:underline dark:text-primary-500 cursor-pointer"
                            onClick={resentOtp}
                        >
                            Resend OTP
                        </button>
                    </div>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className="justify-center focus:ring-0 transition ease-in-out w-full bg-primary border font-bold text-sm enabled:hover:bg-transparent enabled:hover:text-primary hover:border-primary"
                        loading={isLoading}
                    >
                        <HiCheckCircle className="mr-2 h-5 w-5 align-middle" /> Verify OTP
                    </Button>
                    <p className="text-sm font-light dark:text-gray-400">
                        <a href="/login" className="font-medium text-primary hover:underline dark:text-primary-500">
                            Go back to login
                        </a>
                    </p>
                </Form>
            </Card>
        </div>
    );
};

export default OtpVerification;
