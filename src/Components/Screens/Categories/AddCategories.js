import { useEffect, useState } from "react";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useNavigate, useParams } from "react-router-dom";
import { API_URLS } from "../../Utils/AppConst";

function AddCategories() {
    const navigate = useNavigate();
    const { category_id } = useParams();
    const [categoryData, setCategoryData] = useState({ name: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCategoryData({ ...categoryData, [name]: value });

        if (value.trim() !== "") {
            setError("");
        }
    };
    useEffect(() => {
        if (category_id) {
            getSingleCategory();
        }
    }, [category_id]);
    const getSingleCategory = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.CATEGORIES}/${category_id}`,
            data: {},
            callback: getCategoryCallback,
            setLoading: setLoading
        });
    };

    const getCategoryCallback = (response) => {
        if (response.status === 200) {
            setCategoryData({ name: response.data.name });
        } else {
            console.log("Failed to fetch category");
        }
    };

    const addCategoryCallback = (response) => {
        if (response.status === 200) {
            console.log("Category added successfully");
            setCategoryData({ name: "" });
            navigate("/categories");
        } else {
            console.log("Failed to add category");
        }
    };

    const addCategory = () => {
        apiCall({
            method: "POST",
            url: API_URLS.CATEGORIES,
            data: categoryData,
            callback: addCategoryCallback,
        });
    };
    const updateCategory = () => {
        apiCall({
            method: "PUT",
            url: `${API_URLS.CATEGORIES}/${category_id}`,
            data: categoryData,
            callback: addCategoryCallback,
        });
    };

    const handleSubmit = () => {
        if (categoryData.name.trim() === "") {
            setError("Please enter category name");
            return;
        }
        setError("");

        if (category_id) {
            updateCategory();
        } else {
            addCategory();
        }
    };

    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            <div className="w-full p-4">
                {loading && <Spinner />}
                <div className="mb-4">
                    <InputComponents
                        type="text"
                        label={category_id ? "Edit Category" : "Add Category"}
                        name="name"
                        placeholder="Enter Category Name"
                        value={categoryData.name}
                        onChange={handleInputChange}
                        inputClassName="w-[40%]"
                    />
                    {error && (
                        <div className="text-red-600 text-sm mt-1">
                            {error}
                        </div>
                    )}
                </div>
                <div>
                    <PrimaryButtonComponent
                        label="Submit"
                        onClick={handleSubmit}
                        buttonClassName="bg-black text-white px-5 py-2 rounded-md"
                    />
                </div>
            </div>
        </div>
    )
} export default AddCategories;