import { useNavigate } from "react-router-dom";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useEffect, useState } from "react";
import TableComponent from "../../CustomComponents/TableComponent/TableComponent";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import { API_URLS } from "../../Utils/AppConst";
import { SUB_CATEGORIES_COLUMNS } from "./Constants";

function SubCategories() {
    const navigate = useNavigate();
    const handleAddClick = () => {
        navigate("/add-subcategory");
    };
    const [subCategories, setSubCategories] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(false)
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
    const getSubCategoriesCallback = (response) => {
        if (response.status === 200) {
            const subcategories = response.data.map(subcategory => ({
                Name: subcategory.name,
                // Category: subcategory?.category?.name,
                Category: subcategory.category.map(cat => cat.name).join(","),
                Action: (
                    <div
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        title="Edit"
                        onClick={() => navigate(`/add-subcategory/${subcategory._id}`)}
                    >
                        <i className="fa fa-pencil text-gray-700 text-sm" />
                    </div>
                )
            }));
            setSubCategories(subcategories);
        } else {
            console.log("Failed to fetch subcategories");
        }
    };
    const getSubCategories = () => {
        apiCall({
            method: "GET",
            url: API_URLS.SUB_CATEGORIES,
            data: {},
            callback: getSubCategoriesCallback,
            setLoading: setLoading
        });
    };
    useEffect(() => {
        getSubCategories();
        getCategoriesData();
    }, []);

    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <HeaderComponents
                    label="Add SubCategory"
                    name="SubCategories"
                    onClick={handleAddClick}
                    icon="fa fa-plus-circle"
                    buttonClassName="py-1 px-3 text-sm font-bold mb-3"
                />
                <TableComponent
                    headers={SUB_CATEGORIES_COLUMNS}
                    data={subCategories}
                    maxHeight=" h-[84vh]"

                />
            </div>
        </div>
    )
} export default SubCategories;
