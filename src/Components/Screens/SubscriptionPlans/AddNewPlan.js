import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import CustomDropdownComponent from "../../CustomComponents/CustomDropdownComponent/CustomDropdownComponent";
import { API_URLS } from "../../Utils/AppConst";

function AddNewPlan() {
    const navigate = useNavigate();
    const { plan_id } = useParams();
    const statusOptions = ["Active", "Inactive"];
    const [loading, setLoading] = useState(false)
    const [subscriptionPlan, setSubscriptionPlan] = useState({
        name: "",
        price: "",
        duration: "",
        description: "",
        status: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubscriptionPlan({ ...subscriptionPlan, [name]: value });
    };
    useEffect(() => {
        if (plan_id) {
            getSinglePlan();
        }
    }, [plan_id]);
    const getSinglePlan = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.SUBSCRIPTION_PLANS}/${plan_id}`,
            data: {},
            callback: getSinglePlanCallback,
            setLoading: setLoading
        });
    };
    const getSinglePlanCallback = (response) => {
        if (response.status === 200) {
            const plan = response.data;
            setSubscriptionPlan({
                name: plan.name || "",
                price: plan.price || "",
                duration: plan.duration || "",
                description: plan.description || "",
                status: plan.status || "",
            });
        } else {
            console.log("Failed to fetch plan details");
        }
    };
    const addPlanCallback = (response) => {
        if (response.status === 200 || response.status === 201) {
            console.log("Plan added successfully");
            setSubscriptionPlan({
                name: "",
                price: "",
                duration: "",
                description: "",
                status: "",
            });
            navigate("/plans");
        } else {
            console.log("Failed to add plan");
        }
    };
    const addNewPlan = () => {
        apiCall({
            method: "POST",
            url: API_URLS.SUBSCRIPTION_PLANS,
            data: subscriptionPlan,
            callback: addPlanCallback,
            setLoading: setLoading
        });
    };
    const updatePlan = () => {
        apiCall({
            method: "PUT",
            url: `${API_URLS.SUBSCRIPTION_PLANS}/${plan_id}`,
            data: subscriptionPlan,
            callback: updatePlanCallback,
            setLoading: setLoading
        });
    };
    const updatePlanCallback = (response) => {
        if (response.status === 200) {
            console.log("Plan updated successfully");
            navigate("/plans");
        } else {
            console.log("Failed to update plan");
        }
    };
    const handleSubmit = () => {
        if (plan_id) {
            updatePlan();
            // Edit plan
        } else {
            addNewPlan();
            // Add plan
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <DashboardSideBar />
            <div className="p-8 w-full max-w-3xl mx-auto">
                {loading && <Spinner />}
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <h2 className="text-xl font-bold mb-4">
                        {plan_id ? "Edit Subscription Plan" : "Add New Subscription Plan"}
                    </h2>
                    <div className="flex flex-col">
                        <InputComponents
                            name="name"
                            type="text"
                            placeholder="Plan Name"
                            value={subscriptionPlan.name}
                            onChange={handleInputChange}
                            inputClassName="border px-3 py-2 rounded w-full"

                        />
                    </div>
                    <div className="flex flex-col" >
                        <InputComponents
                            name="price"
                            type="text"
                            placeholder="Price"
                            value={subscriptionPlan.price}
                            onChange={handleInputChange}
                            inputClassName="border px-3 py-2 rounded  w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <InputComponents
                            name="duration"
                            type="text"
                            placeholder="Duration"
                            value={subscriptionPlan.duration}
                            onChange={handleInputChange}
                            inputClassName="border px-3 py-2 rounded  w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <InputComponents
                            name="description"
                            type="text"
                            placeholder="Description"
                            value={subscriptionPlan.description}
                            onChange={handleInputChange}
                            inputClassName="border px-3 py-2 rounded  w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <CustomDropdownComponent
                            name="status"
                            options={statusOptions}
                            value={subscriptionPlan.status}
                            onChange={handleInputChange}
                            placeholder="Select status"
                            className="w-full"
                        />

                    </div>
                    <div className="flex flex-col">
                        <PrimaryButtonComponent
                            label="Submit"
                            onClick={handleSubmit}
                            buttonClassName="w-[20%] bg-black text-white px-3 py-2 rounded-md  w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} export default AddNewPlan;