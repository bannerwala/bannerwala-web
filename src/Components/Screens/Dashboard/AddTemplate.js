import CustomDropdownComponent from "../../CustomComponents/CustomDropdownComponent/CustomDropdownComponent";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import { useEffect, useState } from "react";
import { FONT_FAMILY_OPTIONS } from "./Constants";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URLS } from "../../Utils/AppConst";
function AddTemplate() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");
    // const [templateFileBase64, setTemplateFileBase64] = useState("");
    const [categoriesData, setCategoriesData] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    const [templateImage, setTemplateImage] = useState(null);
    const [psdFile, setPsdFile] = useState(null);
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
    const { template_id } = useParams();
    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setTemplateFileBase64(reader.result);
    //     };
    //     reader.readAsDataURL(file);
    // };
    useEffect(() => {
        getCategoriesData();
        // getSubcategoriesData();
        getPlansData();
        if (template_id) getTemplateData();
    }, [template_id]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setTemplateImage(file);
    };

    const handlePsdChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPsdFile(file);
    };

    const getPlansData = () => {
        apiCall({
            method: "GET",
            url: API_URLS.SUBSCRIPTION_PLANS,
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
            navigate("/dashboard")
        } else {
            console.log("Failed to add template.");
        };
    }
    const validateTemplateData = () => {
        const newErrors = {};
        // if (!templateFileBase64) newErrors.template = "Template file is required";
        if (!templateImage && !template_id)
            newErrors.image = "Template image is required";

        if (!psdFile && !template_id)
            newErrors.psd = "PSD file is required";
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
        // console.log("Submitting data:");
        // console.log("Plan:", selectedPlan);
        // console.log("Category:", selectedCategory);
        // console.log("Subcategory:", selectedSubcategory);
        // console.log("Template base64:", templateFileBase64);
        // const requestData = {
        //     // plans: selectedPlan === "Paid",
        //     plans: selectedPlan,
        //     categories: selectedCategory || "",
        //     sub_categories: selectedSubcategory || "",
        //     url: templateFileBase64 || "",
        //     // title_font: titleFont,
        //     // description_font: descFont,
        //     // footer_font: footerFont,
        //     has_multiple_images: isMultiImageBanner

        // };
        const formData = new FormData();

        formData.append("plans", selectedPlan);
        formData.append("categories", selectedCategory || "");
        formData.append("sub_categories", selectedSubcategory || "");
        formData.append("has_multiple_images", isMultiImageBanner);

        formData.append("image", templateImage);
        formData.append("psd_file", psdFile);

        apiCall({
            method: "POST",
            url: API_URLS.TEMPLATES,
            // data: requestData,
            data: formData,
            callback: addTemplatesCallback,
            setLoading: setLoading
        });
    }
    const getCategoriesData = () => {
        let url = API_URLS.CATEGORIES;
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
    // const getSubcategoriesData = () => {
    //     let url = "https://image-edit-backend.vercel.app/api/sub-categories";
    //     apiCall({
    //         method: 'GET',
    //         url: url,
    //         data: {},
    //         callback: getSubcategoriesCallback,
    //     });
    // };
    const getSubcategoriesData = (categoryName) => {
        let url = API_URLS.SUB_CATEGORIES;
        if (categoryName) {
            url += `?categoryName=${categoryName}`;
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getSubcategoriesCallback,
        });
    };
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setSelectedSubcategory("");      // old selection clear
        setSubcategoryOptions([]);       // old options clear

        if (value) {
            getSubcategoriesData(value); // category-wise API call
        }

        setErrors(errors => ({ ...errors, category: "" }));
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
    const getTemplateData = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.TEMPLATES}/${template_id}`,
            data: {},
            callback: getTemplateDataCallback,
            setLoading
        });
    };
    // const getTemplateDataCallback = (response) => {
    //     if (response.status === 200) {
    //         const templateData = response.data;

    //         setSelectedPlan(templateData.plans || "");
    //         setSelectedCategory(templateData.categories || "").join(",");
    //         setSelectedSubcategory(templateData.sub_categories || "");
    //         setTemplateFileBase64(templateData.url || "");
    //         setIsMultiImageBanner(templateData.has_multiple_images || false);
    //     } else {
    //         const errorMsg = response?.data?.error || "Failed to fetch template data";
    //         toast.error(errorMsg, {
    //             position: "top-center",
    //             autoClose: 2000,
    //         });
    //     }
    // };
    const getTemplateDataCallback = (response) => {
        if (response.status === 200) {
            const templateData = response.data;
            const selectedCategories = templateData.categories.map(category => category.name);
            const selectedSubcategories = templateData.sub_categories.map(subcategory => subcategory.name);
            const selectedPlans = templateData.plans.map(plan => plan.name);


            setSelectedPlan(selectedPlans || "");
            setSelectedCategory(selectedCategories);
            setSelectedSubcategory(selectedSubcategories);
            // setTemplateFileBase64(templateData.url || "");
            setIsMultiImageBanner(templateData.has_multiple_images || false);
        } else {
            const errorMsg = response?.data?.error || "Failed to fetch template data";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const editTemplateData = () => {
        if (!validateTemplateData()) return;
        // const requestData = {
        //     plans: selectedPlan,
        //     categories: selectedCategory,
        //     sub_categories: selectedSubcategory,
        //     url: templateFileBase64,
        //     has_multiple_images: isMultiImageBanner
        // };

        const formData = new FormData();

        formData.append("plans", selectedPlan);
        formData.append("categories", selectedCategory);
        formData.append("sub_categories", selectedSubcategory);
        formData.append("has_multiple_images", isMultiImageBanner);

        if (templateImage)
            formData.append("image", templateImage);

        if (psdFile)
            formData.append("psd_file", psdFile);

        apiCall({
            method: "PUT",
            url: `${API_URLS.TEMPLATES}/${template_id}`,
            // data: requestData,
            data: formData,
            callback: editTemplateCallback,
            setLoading
        });
    };
    const editTemplateCallback = (response) => {
        if (response.status === 200) {
            toast.success("Template updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/dashboard");
        } else {
            const errorMsg = response?.data?.error || "Failed to update template";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleSubmit = () => {
        if (template_id)
            editTemplateData();
        else
            addTemplateData();
    };

    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            <div className="p-6 w-full">
                {loading && <Spinner />}
                <div className="rounded-lg">
                    <h2 className="text-xl font-serif mb-4">{template_id ? "Edit Template" : "Add Template"}</h2>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                        <div className="flex flex-col">
                            {/* <label className="font-serif font-bold mb-1">Template File</label>
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
                            )} */}

                            <div className="flex flex-col">
                                <label className="font-serif font-bold mb-1">PSD File</label>
                                <input
                                    type="file"
                                    accept=".psd"
                                    onChange={(e) => {
                                        handlePsdChange(e);
                                        setErrors(prev => ({ ...prev, psd: "" }));
                                    }}
                                    className="border p-2 rounded w-[80%]"
                                />
                                {errors.psd && (
                                    <span className="text-red-500 text-sm">{errors.psd}</span>
                                )}
                            </div>
                            <label className="font-serif font-bold mb-1">Template Image</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={(e) => {
                                    handleImageChange(e);
                                    setErrors(prev => ({ ...prev, image: "" }));
                                }}
                                className="border p-2 rounded w-[80%]"
                            />
                            {errors.image && (
                                <span className="text-red-500 text-sm">{errors.image}</span>
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
                            // onChange={(value) => {
                            //     setSelectedCategory(value);
                            //     setErrors(errors => ({ ...errors, category: "" }));
                            // }}
                            onChange={handleCategoryChange}
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
                            disabled={!selectedCategory}
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
                            // onClick={addTemplateData}
                            onClick={handleSubmit}
                        />
                    </div>

                </div>
            </div>
        </div>

    );
}
export default AddTemplate;