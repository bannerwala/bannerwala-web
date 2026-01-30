import { useNavigate } from "react-router-dom";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const [loginFormData, setLoginFormData] = useState({
        contact_number: "",
        password: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
        setErrors(errors => ({ ...errors, [name]: "" }));
    };

    const loginCallback = (response) => {
        if (response.status === 200) {
            navigate("/dashboard");
        } else {
            const errorMsg = response?.data?.error || "Login failed. Please check your credentials.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const validateLogin = () => {
        const newErrors = {};
        if (!loginFormData.contact_number.trim()) {
            newErrors.contact_number = "Please Enter Contact Number";
        } else if (loginFormData.contact_number.length !== 10) {
            newErrors.contact_number = "Contact number must be 10 digits";
        }

        if (!loginFormData.password.trim()) {
            newErrors.password = "Please Enter Password";
        }
        setErrors(newErrors);
    };

    const handleLoginClick = () => {
        validateLogin();
        if (!loginFormData.contact_number.trim() || loginFormData.contact_number.length !== 10 || !loginFormData.password.trim()) {
            return;

        }
        apiCall({
            method: "POST",
            url: "https://image-edit-backend.vercel.app/api/users/login",
            data: loginFormData,
            callback: loginCallback,
            setLoading: setLoading
        });
    };
    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://cdn.vectorstock.com/i/500p/45/63/wave-green-background-abstract-modern-vector-48874563.jpg')",
            }}
        >
            <div className="bg-white  p-10 rounded-xl shadow-2xl w-full max-w-lg mx-4">
                {loading && <Spinner />}
                <div className="text-3xl font-bold text-black text-center mb-8">
                    Welcome To Image Editor
                </div>

                <InputComponents
                    type="text"
                    name="contact_number"
                    placeholder="Mobile No"
                    inputClassName="w-full"
                    value={loginFormData.contact_number}
                    error={errors.contact_number}
                    onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');
                        if (input.length <= 10) {
                            setLoginFormData({ ...loginFormData, contact_number: input });
                            setErrors(errors => ({ ...errors, contact_number: "" }));
                        }
                    }}
                    maxLength={10}
                />
                <InputComponents
                    type="text"
                    name="password"
                    placeholder="Password"
                    inputClassName="w-full mt-4 mb-4"
                    value={loginFormData.password}
                    error={errors.password}
                    onChange={handleInputChange}
                />

                <PrimaryButtonComponent
                    label={loading ? "Logging in..." : "Log In"}
                    onClick={handleLoginClick}
                    buttonClassName="w-full py-4 text-lg bg-blue-600 text-white font-serif font-bold rounded-lg hover:bg-blue-700 transition duration-200"
                />
            </div>
        </div>
    );
}

export default Login;
