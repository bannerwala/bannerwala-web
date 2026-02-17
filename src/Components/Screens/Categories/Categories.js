import { useNavigate } from "react-router-dom";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import TableComponent from "../../CustomComponents/TableComponent/TableComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import { useEffect, useState } from "react";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import { API_URLS } from "../../Utils/AppConst";
import { CATEGORIES_COLUMNS } from "./Constants";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleAddClick = () => {
        navigate("/add-category");
    };
    const getCategoriesCallback = (response) => {
        if (response.status === 200) {
            const updated = response.data.map((category) => ({
                Name: category.name,
                Action: (
                    <div
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        title="Edit"
                        onClick={() => navigate(`/add-category/${category._id}`)}
                    >
                        <i className="fa fa-pencil text-gray-700 text-sm" />
                    </div>
                ),
            }));
            setCategories(updated);
        } else {
            console.log("Failed to fetch categories");
        }
    };
    const getCategories = () => {
        apiCall({
            method: "GET",
            url: API_URLS.CATEGORIES,
            callback: getCategoriesCallback,
            setLoading: setLoading
        });
    };

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <HeaderComponents
                    label="Add Category"
                    icon="fa fa-plus-circle"
                    name="Categories"
                    onClick={handleAddClick}
                    buttonClassName="py-1 px-3 text-sm font-bold mb-2"
                />
                <TableComponent
                    headers={CATEGORIES_COLUMNS}
                    data={categories}
                    maxHeight="h-[84vh]"
                    onRowClick={(row) => {
                        console.log("Clicked row:", row);
                    }} />
            </div>
        </div>
    );
}
export default Categories;
