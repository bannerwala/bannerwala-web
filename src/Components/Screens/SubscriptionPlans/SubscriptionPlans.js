import { useNavigate } from "react-router-dom";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { API_URLS } from "../../Utils/AppConst";

function SubscriptionPlans() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleAddPlanClick = () => {
        navigate("/add-plan");
    };
    const getPlansCallback = (response) => {
        if (response.status === 200) {
            setPlans(response.data);
        } else {
            console.log("Failed to fetch subscription plans");
        }
    };
    const getPlans = () => {
        apiCall({
            method: "GET",
            url: API_URLS.SUBSCRIPTION_PLANS,
            data: {},
            callback: getPlansCallback,
            setLoading: setLoading
        });
    };
    useEffect(() => {
        getPlans();
    }, []);
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <HeaderComponents
                    name="Subscription Plans"
                    icon="fa fa-plus-circle"
                    label="Add New Plan"
                    onClick={handleAddPlanClick}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 ">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
                        >
                            <div>
                                <div className="text-xl font-bold mb-2">{plan.name}</div>
                                <div className="text-gray-700 text-sm mb-1">
                                    <strong>Price:</strong> {plan.price}
                                </div>
                                <div className="text-gray-700 text-sm mb-1">
                                    <strong>Duration:</strong> {plan.duration}
                                </div>
                                <div className="text-gray-700 text-sm mb-3">
                                    <strong>Description:</strong> {plan.description}
                                </div>
                                <div className="text-gray-700 text-sm mb-1">
                                    <strong>Status:</strong> {plan.status}
                                </div>
                            </div>

                            <PrimaryButtonComponent
                                label="Edit"
                                onClick={() => navigate(`/add-plan/${plan._id}`)}
                                buttonClassName="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 mt-2"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SubscriptionPlans;
