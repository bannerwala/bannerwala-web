import { useEffect, useState } from "react";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import CategoryCardComponent from "../../CustomComponents/CategoryCardComponent/CategoryCardComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate } from "react-router-dom";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import DropdownInputComponent from "../../CustomComponents/DropdownInputComponent/DropdownInputComponent";
import { API_URLS } from "../../Utils/AppConst";
export default function Dashboard() {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const initialLimit = 10; // First load
    const scrollLimit = 2;   // After scroll
    const navigate = useNavigate();
    const fetchCategoriesCallback = (response) => {
        if (response.status === 200) {
            const categories = response.data.map(c => c.name);
            setCategoryOptions(categories);
        } else {
            console.error("Failed to fetch categories");
        }
    };
    const getCategoriesData = () => {
        apiCall({
            method: "GET",
            url: API_URLS.CATEGORIES,
            callback: fetchCategoriesCallback
        });
    };
    const fetchSubcategoriesCallback = (response) => {
        if (response.status === 200) {
            const subcategories = response.data.map(s => s.name);
            setSubcategoryOptions(subcategories);
        } else {
            console.error("Failed to fetch subcategories");
        }
    };
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
    // const handleCategoryChange = (value) => {
    //     setCategory(value);
    //     setSubcategory("");

    //     if (value) {
    //         getSubcategoriesData(value);
    //     } else {
    //         getSubcategoriesData();
    //     }
    // };
    const handleCategoryChange = (value) => {
        setCategory(value);
        setSubcategory(""); // reset subcategory
        if (value) {
            getSubcategoriesData(value);
        } else {
            setSubcategoryOptions([]); // clear subcategories if no category
        }
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category: value, subcategory: "", offsetValue: 0, limitValue: initialLimit });
    };

    const handleSubcategoryChange = (value) => {
        setSubcategory(value);
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category, subcategory: value, offsetValue: 0, limitValue: initialLimit });
    };

    // const getTemplatesCallback = (response, offsetValue, isInitial) => {
    //     if (response.status === 200) {
    //         const newTemplates = response.data || [];
    //         if (offsetValue === 0) {
    //             setTemplates(newTemplates);
    //         } else {
    //             setTemplates((prev) => [...prev, ...newTemplates]);
    //         }
    //         setHasMore(newTemplates.length === limit);
    //         setOffset(offsetValue + newTemplates.length);
    //     } else {
    //         console.error("Failed to fetch templates", response);
    //     }
    //     if (isInitial) setLoading(false);
    // };
    const getTemplatesCallback = (response, currentOffset, limitUsed) => {
        if (response.status === 200) {
            const newTemplates = response.data || [];
            if (currentOffset === 0) setTemplates(newTemplates);
            else setTemplates(prev => [...prev, ...newTemplates]);
            setHasMore(newTemplates.length === limitUsed);
            setOffset(currentOffset + newTemplates.length);
        }
        setLoading(false);
    };
    const getTemplateData = ({ category, subcategory, offsetValue = 0, limitValue }) => {
        if (loading) return;
        setLoading(true);
        // let url = `${API_URLS.TEMPLATES}?limit=${limit}&offset=${offset}`;
        // let url = API_URLS.TEMPLATES_URLS;
        let url = `${API_URLS.TEMPLATES}?limit=${limitValue}&offset=${offsetValue}`;
        if (category) url += `&category=${category}`;
        if (subcategory) url += `&sub_category=${subcategory}`;
        apiCall({
            method: "GET",
            url,
            data: {},
            callback: (response) => getTemplatesCallback(response, offsetValue, limitValue)
        });
    };
    useEffect(() => {
        getCategoriesData();
        // getSubcategoriesData();
        getTemplateData({ category: "", subcategory: "", offsetValue: 0, limitValue: initialLimit });
    }, []);
    const handleAddTemplateClick = () => {
        navigate("/add-template");
    };
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 5;
        if (isBottom && hasMore && !loading) {
            getTemplateData({ category, subcategory, offsetValue: offset, limitValue: scrollLimit });
        }
    };
    const handleSearchFilter = () => {
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category, subcategory, offsetValue: 0, limitValue: initialLimit });
    };
    const handleResetFilter = () => {
        setCategory('');
        setSubcategory('');
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getSubcategoriesData();
        getTemplateData({ category: "", subcategory: "", offsetValue: 0, limitValue: initialLimit });
    };
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && offset === 0 && <Spinner />}
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
                                onChange={handleSubcategoryChange}
                                dropdownClassName="w-[90%]"
                                disabled={!category}
                            />
                        </div>
                        {/* <PrimaryButtonComponent
                            label="Search"
                            icon="fa fa-search"
                            onClick={handleSearchFilter}
                            buttonClassName="py-1 px-3 text-sm font-bold"

                        /> */}
                        <PrimaryButtonComponent
                            label="Reset"
                            icon="fa fa-refresh"
                            onClick={handleResetFilter}
                            buttonClassName="py-1 px-3 text-sm font-bold "

                        />
                    </div>
                </div>
                {/* <div onScroll={handleScroll} className="grid grid-cols-5 gap-6 h-[77vh] overflow-y-auto">
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
 */}
                <div
                    onScroll={handleScroll}
                    className="grid grid-cols-5 gap-6 h-[77vh] overflow-y-auto"
                >
                    {templates.map((cat, i) => (
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

                    {loading && offset !== 0 && (
                        <div className="col-span-5 text-center py-4">
                            Loading more templates...
                        </div>
                    )}
                </div>

            </div>
        </div>

    );
}
