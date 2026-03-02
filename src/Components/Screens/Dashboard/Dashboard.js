import { useEffect, useState } from "react";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import CategoryCardComponent from "../../CustomComponents/CategoryCardComponent/CategoryCardComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate } from "react-router-dom";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import DropdownInputComponent from "../../CustomComponents/DropdownInputComponent/DropdownInputComponent";
import { API_URLS } from "../../Utils/AppConst";
import { toast } from "react-toastify";
import CustomConfirmationPopup from "../../CustomComponents/CustomConfirmationPopup/CustomConfirmationPopup";
export default function Dashboard() {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
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
    
    const handleCategoryChange = (value) => {
        setCategory(value);
        setSubcategory(""); // reset subcategory
        if (value) {
            getSubcategoriesData(value);
        } else {
            setSubcategoryOptions([]); // clear subcategories if no category
        }
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category: value, subcategory: ""});
    };

    const handleSubcategoryChange = (value) => {
        setSubcategory(value);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category, subcategory: value });
    };




    const getTemplatesCallback = async (response, limitUsed) => {
        if (response.status === 200) {
            const templateList = response.data || [];
            const newTemplates = await Promise.all(
                templateList.map(async (template) => {
                    const fileKey = template.url?.key;

                    if (!fileKey) return template;
                    try {
                        const res = await fetch(
                            `${API_URLS.TEMPLATES}/signed-url?key=${fileKey}`
                        );

                        const data = await res.json();

                        return {
                            ...template,
                            url: data.url
                        };

                    } catch (error) {
                        console.error("Signed URL error:", error);
                        return template;
                    }
                })
            );
                setTemplates(prev => [...prev, ...newTemplates]);

            setHasMore(newTemplates.length === limitUsed);
        }
        setLoading(false);
    };
    const getTemplateData = ({ category, subcategory }) => {
        if (loading) return;
        setLoading(true);
        let url = `${API_URLS.TEMPLATES}`;
        if (category) url += `&category=${category}`;
        if (subcategory) url += `&sub_category=${subcategory}`;
        apiCall({
            method: "GET",
            url,
            data: {},
            callback: (response) => getTemplatesCallback(response,)
        });
    };
    useEffect(() => {
        getCategoriesData();
        getTemplateData({ category: "", subcategory: "" });
    }, []);
    const handleAddTemplateClick = () => {
        navigate("/add-template");
    };
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 5;
        if (isBottom && hasMore && !loading) {
            getTemplateData({ category, subcategory});
        }
    };
    const handleSearchFilter = () => {
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getTemplateData({ category, subcategory});
    };
    const handleResetFilter = () => {
        setCategory('');
        setSubcategory('');
        setOffset(0);
        setHasMore(true);
        setTemplates([]);
        getSubcategoriesData();
        getTemplateData({ category: "", subcategory: "" });
    };
    const deleteTemplateCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            toast.success("Template deleted successfully!", {
                position: "top-center",
                autoClose: 2000
            });
            setOffset(0);
            setHasMore(true);
            setTemplates([]);

            getTemplateData({
                category,
                subcategory,
            });
        } else {
            const errorMsg = response?.data?.error || "Failed to delete template";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const deleteTemplate = (templateId) => {
        setLoading(true);
        apiCall({
            method: "DELETE",
            url: `${API_URLS.TEMPLATES}/${templateId}`,
            callback: (response) => deleteTemplateCallback(response, templateId)
        });
    };
    const handleConfirmDelete = () => {
        if (!templateToDelete) return;

        deleteTemplate(templateToDelete);
        setShowDeletePopup(false);
        setTemplateToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setTemplateToDelete(null);
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
                        <PrimaryButtonComponent
                            label="Reset"
                            icon="fa fa-refresh"
                            onClick={handleResetFilter}
                            buttonClassName="py-1 px-3 text-sm font-bold "

                        />
                    </div>
                </div>
                <div
                    onScroll={handleScroll}
                    className="grid grid-cols-5 gap-6 h-[77vh] overflow-y-auto"
                >
                    {templates.map((cat, i) => (
                        <div key={i} className="relative cursor-pointer ">
                            <div className="group relative">
                                <CategoryCardComponent img={cat.url} />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 flex gap-1">
                                    <i
                                        className="fa fa-edit text-white bg-black p-1 rounded cursor-pointer"
                                        onClick={() => navigate(`/add-template/${cat._id}`)}
                                    />
                                    <i
                                        className="fa fa-trash text-white bg-red-600 p-1 rounded cursor-pointer"
                                        onClick={() => {
                                            setTemplateToDelete(cat._id);
                                            setShowDeletePopup(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && offset !== 0 && (
                        <div className="col-span-5 text-center py-4">
                            Loading more templates...
                        </div>
                    )}
                </div>
                {showDeletePopup && (
                    <CustomConfirmationPopup
                        label="Are you sure you want to delete this Template?"
                        handleCancelButton={handleCancelDelete}
                        handleDeleteButton={handleConfirmDelete}
                    />
                )}
            </div>
        </div>

    );
}
