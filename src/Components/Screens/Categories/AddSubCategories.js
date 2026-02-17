import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents"
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent"
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar"
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useEffect, useState } from "react";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";
import { API_URLS } from "../../Utils/AppConst";

function AddSubCategories() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [subCategoryData, setSubCategoryData] = useState({
        name: "",
        category: ""
    });
    const { subcategory_id } = useParams();
    const [errors, setErrors] = useState({});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSubCategoryData({ ...subCategoryData, [name]: value });
        setErrors(errors => ({ ...errors, [name]: "" }));
    };
    const [categoriesData, setCategoriesData] = useState([]);
    useEffect(() => {
        getCategoriesData();

        if (subcategory_id) {
            getSubCategoryById();
        }
    }, [subcategory_id]);


    const getCategoriesData = () => {
        apiCall({
            method: "GET",
            url: API_URLS.CATEGORIES,
            data: {},
            callback: getCategoriesCallback,
        });
    };

    const getCategoriesCallback = (response) => {
        if (response.status === 200) {
            const categories = response.data.map(category => category.name);
            setCategoriesData(categories);
        } else {
            console.log("Error fetching categories");
        }
    };
    const getSubCategoryById = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.SUB_CATEGORIES}/${subcategory_id}`,
            data: {},
            setLoading: setLoading,
            callback: (response) => {
                if (response.status === 200) {
                    const subcategory = response.data;
                    setSubCategoryData({
                        name: subcategory.name || "",
                        category: subcategory.category?.name || "",
                    });
                } else {
                    console.log("Failed to fetch subcategory details");
                }
            }
        });
    };

    const addSubCategoryCallback = (response) => {
        if (response.status === 200) {
            console.log("SubCategory added successfully");
            setSubCategoryData({ name: "", category: ""});
            navigate("/subcategories");
        } else {
            console.log("Failed to add subcategory");
        }
    };
    const validateSubCategory = () => {
        const newErrors = {};

        if (!subCategoryData.category.length) {
            newErrors.category = "Please select at least one category";
        }

        if (!subCategoryData.name.trim()) {
            newErrors.name = "Please enter subcategory name";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const validateSubCategory = () => {
    //     const newErrors = {};

    //     // if (typeof subCategoryData.category !== "string" || !subCategoryData.category.trim()) {
    //     //     newErrors.category = "Please select a category";
    //     // }

    //     if (!subCategoryData.name.trim()) {
    //         newErrors.name = "Please enter subcategory name";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const addSubCategory = () => {
        if (!validateSubCategory()) {
            return;
        }
        apiCall({
            method: "POST",
            url: API_URLS.SUB_CATEGORIES,
            data: subCategoryData,
            callback: addSubCategoryCallback,
        });
    };
    const updateSubCategory = () => {
        if (!validateSubCategory()) return;

        apiCall({
            method: "PUT",
            url: `${API_URLS.SUB_CATEGORIES}/${subcategory_id}`,
            data: subCategoryData,
            callback: (response) => {
                if (response.status === 200) {
                    console.log("SubCategory updated successfully");
                    navigate("/subcategories");
                } else {
                    console.log("Failed to update subcategory");
                }
            }
        });
    };
    const handleSubmit = () => {
        if (subcategory_id) {
            updateSubCategory();
        } else {
            addSubCategory();
        }
    };

    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            <div className="w-full p-4">
                {loading && <Spinner />}
                <h2 className="text-xl font-serif mb-4">
                    {subcategory_id ? "Edit SubCategory" : "Add SubCategory"}
                </h2>
                <div className="mb-4">
                    <DropdownComponent
                        label="Add Category"
                        options={categoriesData}
                        value={subCategoryData.category}
                        onChange={(selectedValue) => {
                            setSubCategoryData({ ...subCategoryData, category: selectedValue });
                            setErrors(errors => ({ ...errors, category: "" }));
                        }}
                        dropdownClassName="w-[190px]"
                        error={errors.category}
                    />
                </div>
                <div className="mb-4">
                    <InputComponents
                        label="Add Subcategory"
                        type="text"
                        name="name"
                        placeholder="SubCategory"
                        value={subCategoryData.name}
                        onChange={handleInputChange}
                        inputClassName="w-[190px]"
                        error={errors.name}
                    />
                </div>
                <div>
                    <PrimaryButtonComponent
                        label="Submit"
                        onClick={handleSubmit}
                        buttonClassName="w-[20%] bg-black text-white px-3 py-2 rounded-md"
                    />
                </div>
            </div>
        </div>
    )
} export default AddSubCategories;