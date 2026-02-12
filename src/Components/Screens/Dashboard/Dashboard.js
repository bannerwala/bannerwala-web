import { useEffect, useState } from "react";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import CategoryCardComponent from "../../CustomComponents/CategoryCardComponent/CategoryCardComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate } from "react-router-dom";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import DropdownInputComponent from "../../CustomComponents/DropdownInputComponent/DropdownInputComponent";
import { API_URLS } from "../../Utils/AppConst";
export default function Dashboard() {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 2;
    const navigate = useNavigate();
    // useEffect(() => {
    //     getTemplateData({ category: "", subcategory: "", offset: 0, isInitial: true });
    // }, []);
    // useEffect(() => {
    //     if (hasMore && !loading) {
    //         getTemplateData({ category, subcategory, offset, isInitial: false });
    //     }
    // }, [templates]);
    const fetchCategoriesCallback = (response) => {
        if (response.status === 200) {
            const categories = response.data.map(c => c.name);
            setCategoryOptions(categories);
        } else {
            console.error("Failed to fetch categories");
        }
    };

    const fetchSubcategoriesCallback = (response) => {
        if (response.status === 200) {
            const subcategories = response.data.map(s => s.name);
            setSubcategoryOptions(subcategories);
        } else {
            console.error("Failed to fetch subcategories");
        }
    };
    const getTemplatesCallback = (response, offsetValue, isInitial) => {
        if (response.status === 200) {
            const newTemplates = response.data || [];
            if (offsetValue === 0) {
                setTemplates(newTemplates);
            } else {
                setTemplates((prev) => [...prev, ...newTemplates]);
            }
            setHasMore(newTemplates.length === limit);
            setOffset(offsetValue + newTemplates.length);
        } else {
            console.error("Failed to fetch templates", response);
        }
        if (isInitial) setLoading(false);
    };
    const getCategoriesData = () => {
        apiCall({
            method: "GET",
            url: API_URLS.CATEGORIES,
            callback: fetchCategoriesCallback
        });
    };

    // const getSubcategoriesData = () => {
    //     apiCall({
    //         method: "GET",
    //         url: "https://image-edit-backend.vercel.app/api/sub-categories",
    //         callback: fetchSubcategoriesCallback
    //     });
    // };
    // const getSubcategoriesData = (categoryName) => {
    //     apiCall({
    //         method: "GET",
    //         url: `https://image-edit-backend.vercel.app/api/sub-categories?categoryName=${categoryName}`,
    //         callback: fetchSubcategoriesCallback
    //     });
    // };
    const getSubcategoriesData = (categoryName = "") => {
        let url = API_URLS.SUB_CATEGORIES;
        if (categoryName) {
            url += `?categoryName=${categoryName}`;
        }

        apiCall({
            method: "GET",
            url,
            callback: fetchSubcategoriesCallback
        });
    };
    const handleCategoryChange = (value) => {
        setCategory(value);
        setSubcategory("");

        if (value) {
            getSubcategoriesData(value);
        } else {
            getSubcategoriesData();
        }
    };

    useEffect(() => {
        getCategoriesData();
        getSubcategoriesData();
        getTemplateData({ category: "", subcategory: "", offset: 0, isInitial: true });
    }, []);

    useEffect(() => {
        if (hasMore && !loading) {
            getTemplateData({ category, subcategory, offset, isInitial: false });
        }
    }, [templates]);

    const getTemplateData = ({ category, subcategory, offset = 0, isInitial = false }) => {
        let url = `${API_URLS.TEMPLATES}?limit=${limit}&offset=${offset}`;
        if (category) url += `&category=${category}`;
        if (subcategory) url += `&sub_category=${subcategory}`;
        apiCall({
            method: "GET",
            url,
            data: {},
            // callback: getTemplatesCallback,
            callback: (response) => getTemplatesCallback(response, offset),
            setLoading: isInitial ? setLoading : undefined
        });
    };
    const handleSearchFilter = () => {
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category, subcategory, offset: 0, isInitial: true });
    };
    const handleResetFilter = () => {
        setCategory('');
        setSubcategory('');
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getSubcategoriesData();
        getTemplateData({ category: "", subcategory: "", offset: 0, isInitial: true });
    };
    const handleAddTemplateClick = () => {
        navigate("/add-template");
    };
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
            getTemplateData({ category, subcategory, offset, isInitial: false });
        }
    };
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <HeaderComponents
                    name="All Templates"
                    icon="fa fa-plus-circle"
                    label="Add New Template"
                    onClick={handleAddTemplateClick}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />

                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-5">
                        <div>
                            <DropdownInputComponent
                                placeholder="Select Category"
                                options={categoryOptions}
                                value={category}
                                onChange={handleCategoryChange}
                                dropdownClassName="w-[90%]"
                            />
                        </div>
                        <div>
                            <DropdownInputComponent
                                placeholder="Select Subcategory"
                                options={subcategoryOptions}
                                value={subcategory}
                                onChange={setSubcategory}
                                dropdownClassName="w-[90%]"
                            />
                        </div>
                        <PrimaryButtonComponent
                            label="Search"
                            icon="fa fa-search"
                            onClick={handleSearchFilter}
                            buttonClassName="py-1 px-3 text-sm font-bold"

                        />
                        <PrimaryButtonComponent
                            label="Reset"
                            icon="fa fa-refresh"
                            onClick={handleResetFilter}
                            buttonClassName="py-1 px-3 text-sm font-bold "

                        />
                    </div>
                </div>
                {/* <div onScroll={handleScroll} className="grid grid-cols-5 gap-6 h-[77vh] overflow-y-auto">
                    {templates.map((cat, i) => (
                        <div key={i} className="cursor-pointer">
                            <CategoryCardComponent img={cat.url} />
                        </div>
                    ))}
                </div> */}
                <div onScroll={handleScroll} className="grid grid-cols-5 gap-6 h-[77vh] overflow-y-auto">
                    {templates && templates.map((cat, i) => (
                        <div key={i} className="relative cursor-pointer group">
                            <CategoryCardComponent img={cat.url} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                <i
                                    className="fa fa-edit text-white bg-black p-1 rounded cursor-pointer"
                                    onClick={() => navigate(`/add-template/${cat._id}`)}
                                />
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>

    );
}
