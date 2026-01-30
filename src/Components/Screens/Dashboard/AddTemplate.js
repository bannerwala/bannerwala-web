import CustomDropdownComponent from "../../CustomComponents/CustomDropdownComponent/CustomDropdownComponent";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import { useEffect, useState } from "react";
import { FONT_FAMILY_OPTIONS } from "./Constants";
function AddTemplate() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [templateFileBase64, setTemplateFileBase64] = useState("");
    const [categoriesData, setCategoriesData] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    // const [fontFamily, setFontFamily] = useState("");
    // const [fontSize, setFontSize] = useState("");
    // const [fontColor, setFontColor] = useState("");
    const [planOptions, setPlanOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isMultiImageBanner, setIsMultiImageBanner] = useState(false);
    // const [titleFont, setTitleFont] = useState({
    //     family: "",
    //     size: "",
    //     color: ""
    // });
    // const [descFont, setDescFont] = useState({
    //     family: "",
    //     size: "",
    //     color: ""
    // });
    // const [footerFont, setFooterFont] = useState({
    //     family: "",
    //     size: "",
    //     color: ""
    // });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setTemplateFileBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        getCategoriesData();
        getSubcategoriesData();
        getPlansData();
    }, []);

    const getPlansData = () => {
        apiCall({
            method: "GET",
            url: "https://image-edit-backend.vercel.app/api/subscription-plans",
            data: {},
            callback: getPlansCallback,
        });
    };

    const getPlansCallback = (response) => {
        if (response.status === 200) {
            const plans = response.data.map(plan => plan.name);
            setPlanOptions(plans);
        } else {
            console.log("Failed to fetch plans");
        }
    };

    const addTemplatesCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log("Template added successfully!");
        } else {
            console.log("Failed to add template.");
        };
    }
    const validateTemplateData = () => {
        const newErrors = {};
        if (!templateFileBase64) newErrors.template = "Template file is required";
        if (!selectedPlan) newErrors.plan = "Plan is required";
        if (!selectedCategory) newErrors.category = "Category is required";
        if (!selectedSubcategory) newErrors.subcategory = "Subcategory is required";
        // if (!titleFont.family) newErrors.titleFamily = "Title font family is required";
        // if (!titleFont.size) newErrors.titleSize = "Title font size is required";
        // if (!titleFont.color) newErrors.titleColor = "Title font color is required";
        // if (!descFont.family) newErrors.descFamily = "Description font family is required";
        // if (!footerFont.family) newErrors.footerFamily = "Footer font family is required";
        // if (!footerFont.color) newErrors.footerColor = "Footer font color required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addTemplateData = () => {
        if (!validateTemplateData()) return;
        console.log("Submitting data:");
        console.log("Plan:", selectedPlan);
        console.log("Category:", selectedCategory);
        console.log("Subcategory:", selectedSubcategory);
        console.log("Template base64:", templateFileBase64);
        const requestData = {
            // plans: selectedPlan === "Paid",
            plans: selectedPlan,
            categories: selectedCategory || "",
            sub_categories: selectedSubcategory || "",
            url: templateFileBase64 || "",
            // title_font: titleFont,
            // description_font: descFont,
            // footer_font: footerFont,
            has_multiple_images: isMultiImageBanner

        };
        apiCall({
            method: "POST",
            url: "https://image-edit-backend.vercel.app/api/templates",
            data: requestData,
            callback: addTemplatesCallback,
            setLoading: setLoading
        });
    }
    const getCategoriesData = () => {
        let url = "https://image-edit-backend.vercel.app/api/categories";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getCategoriesCallback,
        });
    };
    const getCategoriesCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const categories = response.data.map(category => category.name);
            setCategoriesData(categories);
            console.log('categories: ', categories);
        } else {
            console.log("Error fetching categories");
        }
    };
    const getSubcategoriesData = () => {
        let url = "https://image-edit-backend.vercel.app/api/sub-categories";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getSubcategoriesCallback,
        });
    };

    const getSubcategoriesCallback = (response) => {
        if (response.status === 200) {
            const subcategories = response.data.map(subcategory => subcategory.name);
            setSubcategoryOptions(subcategories);
            console.log('subcategories: ', subcategories);
        } else {
            console.log("Error fetching subcategories");
        }
    };
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            <div className="p-6 w-full">
                {loading && <Spinner />}
                <div className="rounded-lg">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                        <div className="flex flex-col">
                            <label className="font-serif font-bold mb-1">Template File</label>
                            <input
                                type="file"
                                name="template"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    setErrors(errors => ({ ...errors, template: "" }));
                                }}
                                className="border p-2 rounded w-[80%]"
                            />
                            {errors.template && (
                                <span className="text-red-500 text-sm">{errors.template}</span>
                            )}
                        </div>
                        <DropdownComponent
                            label="Plan"
                            options={planOptions}
                            value={selectedPlan}
                            onChange={(value) => {
                                setSelectedPlan(value);
                                setErrors(errors => ({ ...errors, plan: "" }));
                            }}
                            dropdownClassName="w-[80%]"
                            labelClassName="font-serif font-bold"
                            error={errors.plan}
                        />
                        <DropdownComponent
                            label="Category"
                            options={categoriesData}
                            value={selectedCategory}
                            onChange={(value) => {
                                setSelectedCategory(value);
                                setErrors(errors => ({ ...errors, category: "" }));
                            }}
                            dropdownClassName="w-[80%]"
                            labelClassName="font-serif font-bold"
                            error={errors.category}
                        />
                        <DropdownComponent
                            label="Subcategory"
                            options={subcategoryOptions}
                            value={selectedSubcategory}
                            onChange={(value) => {
                                setSelectedSubcategory(value);
                                setErrors(errors => ({ ...errors, subcategory: "" }));
                            }}
                            dropdownClassName="w-[80%]"
                            labelClassName="font-serif font-bold"
                            error={errors.subcategory}
                        />

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                checked={isMultiImageBanner}
                                onChange={(e) => setIsMultiImageBanner(e.target.checked)}
                            />
                            <label className="font-serif font-bold">Multi-Image Template</label>
                        </div>
                        {/* <div className="col-span-2">
                            <div className="font-serif font-bold mb-2">Title</div>
                            <div className="grid grid-cols-3 gap-4">
                                <CustomDropdownComponent
                                    label="Font Family"
                                    options={FONT_FAMILY_OPTIONS}
                                    value={titleFont.family}
                                    onChange={(e) => {
                                        setTitleFont({ ...titleFont, family: e.target.value });
                                        setErrors(prev => ({ ...prev, titleFamily: "" }));
                                    }}
                                    className="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.titleFamily}
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Size"
                                    placeholder="Enter font size"
                                    value={titleFont.size}
                                    onChange={(e) => {
                                        setTitleFont({ ...titleFont, size: e.target.value });
                                        setErrors(prev => ({ ...prev, titleSize: "" })); 
                                    }}
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.titleSize}
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Color"
                                    placeholder="Enter font color"
                                    value={titleFont.color}
                                    onChange={(e) => {
                                        setTitleFont({ ...titleFont, color: e.target.value });
                                        setErrors(prev => ({ ...prev, titleColor: "" })); 
                                    }}
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.titleColor}
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="font-serif font-bold mb-2">Description</div>
                            <div className="grid grid-cols-3 gap-4">
                                <CustomDropdownComponent
                                    label="Font Family"
                                    options={FONT_FAMILY_OPTIONS}
                                    value={descFont.family}
                                    onChange={(e) => {
                                        setDescFont({ ...descFont, family: e.target.value });
                                        setErrors(prev => ({ ...prev, descFamily: "" }));
                                    }}
                                    className="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.descFamily}
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Size"
                                    placeholder="Enter font size"
                                    value={descFont.size}
                                    onChange={(e) =>
                                        setDescFont({ ...descFont, size: e.target.value })
                                    }
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Color"
                                    placeholder="Enter font color"
                                    value={descFont.color}
                                    onChange={(e) =>
                                        setDescFont({ ...descFont, color: e.target.value })
                                    }
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="font-serif font-bold mb-2">Footer</div>
                            <div className="grid grid-cols-3 gap-4">
                                <CustomDropdownComponent
                                    label="Font Family"
                                    options={FONT_FAMILY_OPTIONS}
                                    value={footerFont.family}
                                    onChange={(e) => {
                                        setFooterFont({ ...footerFont, family: e.target.value });
                                        setErrors(prev => ({ ...prev, footerFamily: "" }));
                                    }}
                                    className="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.footerFamily}
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Size"
                                    placeholder="Enter font size"
                                    value={footerFont.size}
                                    onChange={(e) =>
                                        setFooterFont({ ...footerFont, size: e.target.value })
                                    }
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                />
                                <InputComponents
                                    type="text"
                                    label="Font Color"
                                    placeholder="Enter font color"
                                    value={footerFont.color}
                                    onChange={(e) => {
                                        setFooterFont({ ...footerFont, color: e.target.value });
                                        setErrors(prev => ({ ...prev, footerColor: "" }));
                                    }}
                                    inputClassName="w-[80%]"
                                    labelClassName="font-serif font-bold"
                                    error={errors.footerColor}
                                />
                            </div>
                        </div> */}

                    </div>
                    <div className="flex justify-center mt-6">
                        <PrimaryButtonComponent
                            label="Submit"
                            buttonClassName="bg-black text-white px-6 py-2 text-sm rounded-md"
                            onClick={addTemplateData}
                        />
                    </div>

                </div>
            </div>
        </div>

    );
}
export default AddTemplate;