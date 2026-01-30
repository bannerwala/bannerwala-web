
import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';


function DashboardSideBar() {
    const navigate = useNavigate();

    return (
        <div className="w-[20%] shadow-md py-6 px-4 flex flex-col justify-between  bg-slate-800 h-screen">
            <div className="flex flex-col space-y-4 items-start">
                <PrimaryButtonComponent
                    label="Dashboard"
                    icon="fa fa-home"
                    buttonClassName="bg-white text-gray-800 hover:bg-gray-300"
                    onClick={() => navigate("/dashboard")}
                />
                <PrimaryButtonComponent
                    label="Users List"
                    icon="fa fa-users"
                    buttonClassName="bg-white text-gray-800 hover:bg-gray-300"
                    onClick={() => navigate("/users")}
                />
                <PrimaryButtonComponent
                    label="Subscription Plans"
                    icon="fa fa-credit-card"
                    buttonClassName="bg-white text-gray-800 hover:bg-gray-300"
                    onClick={() => navigate("/plans")}
                />
                <PrimaryButtonComponent
                    label="Categories"
                    icon="fa fa-list"
                    buttonClassName="bg-white text-gray-800 hover:bg-gray-300"
                    onClick={() => navigate("/Categories")}
                />
                <PrimaryButtonComponent
                    label="Subcategories"
                    icon="fa fa-tags"
                    buttonClassName="bg-white text-gray-800 hover:bg-gray-300"
                    onClick={() => navigate("/subcategories")}
                />
            </div>
            <div>
                <PrimaryButtonComponent
                    label="Logout"
                    icon="fa fa-sign-out"
                    buttonClassName="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                        navigate("/");
                    }}
                />
            </div>
        </div>

    );
}

export default DashboardSideBar;
