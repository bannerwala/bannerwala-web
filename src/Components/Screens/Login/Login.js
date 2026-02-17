import { useNavigate } from "react-router-dom";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "../../Utils/AppConst";
import BannerBackground from "../../../Assets/Bannerbackground.png";
import LogoImage from "../../../Assets/logo.jpg.jpeg";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [loginFormData, setLoginFormData] = useState({
        contact_number: "",
        otp: ""
    });
    useEffect(() => {
        let interval = null;
        if (otpSent && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer, otpSent]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
        setErrors(errors => ({ ...errors, [name]: "" }));
    };
    const validate = () => {
        const newErrors = {};

        if (!loginFormData.contact_number.trim()) {
            newErrors.contact_number = "Please enter mobile number";
        } else if (!/^[6-9]\d{9}$/.test(loginFormData.contact_number)) {
            newErrors.contact_number = "Enter valid 10-digit mobile number";
        }

        if (otpSent && !loginFormData.otp.trim()) {
            newErrors.otp = "OTP is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const sendOtpCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            toast.success("OTP sent successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setOtpSent(true);
            setOtpTimer(60);
            setLoginFormData(prev => ({ ...prev, otp: "" }));
        } else {
            const errorMsg = response?.data?.error || "Failed to send OTP";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleSendOtp = () => {
        if (!validate()) return;
        setLoading(true);
        apiCall({
            method: "POST",
            url: API_URLS.SEND_OTP,
            data: { contact_number: loginFormData.contact_number },
            callback: sendOtpCallback,
            setLoading
        });
    };
    const handleResendOtp = () => {
        setOtpTimer(60);
        apiCall({
            method: "POST",
            url: API_URLS.SEND_OTP,
            data: { contact_number: loginFormData.contact_number },
            callback: sendOtpCallback,
            setLoading
        });
    };
    const loginCallback = (response) => {
        if (response.status === 200) {
            localStorage.setItem('isAuthenticated', 'true');
            console.log("Success");
            // localStorage.setItem("loggedinPhoneNumber", loginFormData.contact_number);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            toast.success("Logged in successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/dashboard");
        } else {
            const errorMsg = response?.data?.error || "Login failed. Please check your credentials.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleLoginClick = () => {
        if (!validate()) return;
        setLoading(true);
        apiCall({
            method: "POST",
            url: API_URLS.LOGIN,
            data: loginFormData,
            callback: loginCallback,
            setLoading
        });
    };
    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${BannerBackground})` }}
        >
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg mx-4 relative">
                {loading && <Spinner />}
                <div className="flex justify-center mb-4">
                    <img src={LogoImage} alt="Logo" className="w-58 h-64 object-contain" />
                </div>

                <div className="text-3xl font-bold text-black text-center mb-8">
                    Welcome To BannerWala
                </div>

                <InputComponents
                    type="text"
                    name="contact_number"
                    placeholder="Mobile No"
                    inputClassName="w-full mb-4"
                    error={errors.contact_number}
                    value={loginFormData.contact_number}
                    onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');
                        if (input.length <= 10) {
                            setLoginFormData({ ...loginFormData, contact_number: input });
                            setErrors(errors => ({ ...errors, contact_number: "" }));
                        }
                    }}
                    maxLength={10}
                />
                {otpSent && (
                    <>
                        <InputComponents
                            type="text"
                            name="otp"
                            placeholder="OTP"
                            value={loginFormData.otp}
                            onChange={handleInputChange}
                            maxLength={6}
                            error={errors.otp}
                            inputClassName="w-full mb-2"
                        />
                        <div className="text-sm text-gray-600 mb-4">
                            {otpTimer > 0 ? (
                                <span>
                                    Resend OTP in{" "}
                                    <b>
                                        {Math.floor(otpTimer / 60)}:
                                        {(otpTimer % 60)
                                            .toString()
                                            .padStart(2, "0")}
                                    </b>
                                </span>
                            ) : (
                                <span>
                                    <span className="text-black">Didn't Receive? </span>
                                    <span
                                        className="text-blue-600 cursor-pointer font-bold"
                                        onClick={handleResendOtp}
                                    >
                                        Resend OTP
                                    </span>
                                </span>
                            )}
                        </div>
                    </>
                )}
                <div className="flex justify-center">
                    {!otpSent ? (
                        <PrimaryButtonComponent
                            label="Send OTP"
                            onClick={handleSendOtp}
                            buttonClassName="w-full py-4 text-lg bg-blue-600 text-white font-bold rounded-lg"
                        />
                    ) : (
                        <PrimaryButtonComponent
                            label="Verify & Login"
                            onClick={handleLoginClick}
                            buttonClassName="w-full py-4 text-lg bg-blue-600 text-white font-bold rounded-lg"
                        />
                    )}
                </div>
            </div>
        </div >
    );
}

export default Login;
