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
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState([]);
    // const [selectedPlan, setSelectedPlan] = useState([]);
    // const [templateFileBase64, setTemplateFileBase64] = useState("");
    const [categoriesData, setCategoriesData] = useState([]);
    // const [subcategoryOptions, setSubcategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false)
    // const [templateImage, setTemplateImage] = useState(null);
    const [psdFile, setPsdFile] = useState(null);
    // const [fontFamily, setFontFamily] = useState("");
    // const [fontSize, setFontSize] = useState("");
    // const [fontColor, setFontColor] = useState("");
    // const [planOptions, setPlanOptions] = useState([]);
    const [errors, setErrors] = useState({});
    // const [isMultiImageBanner, setIsMultiImageBanner] = useState(false);
    const [hasBannerFooter, setHasBannerFooter] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
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
        // getPlansData();
        if (template_id) getTemplateData();
    }, [template_id]);
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     setTemplateImage(file);
    // };

    const handlePsdChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPsdFile(file);
        // setErrors(prev => ({ ...prev, psd: "" }));
    };

    // const getPlansData = () => {
    //     apiCall({
    //         method: "GET",
    //         url: API_URLS.SUBSCRIPTION_PLANS,
    //         data: {},
    //         callback: getPlansCallback,
    //     });
    // };

    // const getPlansCallback = (response) => {
    //     if (response.status === 200) {
    //         const plans = response.data.map(plan => plan.name);
    //         setPlanOptions(plans);
    //     } else {
    //         console.log("Failed to fetch plans");
    //     }
    // };

    const addTemplatesCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 201) {
            toast.success("Template added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/dashboard");
        } else {
            console.log("Failed to add template.");
        };
    }
    const validateTemplateData = () => {
        const newErrors = {};
        // if (!templateFileBase64) newErrors.template = "Template file is required";
        // if (!templateImage && !template_id)
        //     newErrors.image = "Template image is required";
        // if (!selectedPlan) newErrors.plan = "Plan is required";
        if (!psdFile && !template_id)
            newErrors.psd = "PSD file is required";

        if (!selectedCategory || selectedCategory.length === 0)
            newErrors.category = "Category is required";

        // Only validate subcategory if at least one category is selected
        if (selectedCategory.length > 0 && (!selectedSubcategory || selectedSubcategory.length === 0))
            newErrors.subcategory = "Subcategory is required";
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
        const formData = new FormData();

        // formData.append("plans", selectedPlan);
        formData.append("categories", selectedCategory || "");
        formData.append("sub_categories", selectedSubcategory || "");
        // formData.append("has_multiple_images", isMultiImageBanner);
        formData.append("has_banner_footer", hasBannerFooter);

        // formData.append("image", templateImage);
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
    const handleCategoryChange = (updatedCategories) => {
        setSelectedCategory(updatedCategories);
        updatedCategories.forEach(categoryName => {
            if (!subcategoryOptions.some(sub => sub.category === categoryName)) {
                getSubcategoriesData(categoryName, true);
            }
        });
        setSubcategoryOptions(prev =>
            prev.filter(sub => updatedCategories.includes(sub.category))
        );
        setSelectedSubcategory(prev =>
            prev.filter(subName =>
                updatedCategories.some(cat =>
                    subcategoryOptions.find(sub => sub.name === subName && sub.category === cat)
                )
            )
        );
        setErrors(prev => ({ ...prev, category: "", subcategory: "" }));
    };
    const getSubcategoriesCallback = (response, categoryName, merge = false) => {
        if (response.status === 200) {
            const subcategories = response.data.map(sub => ({
                name: sub.name,
                category: categoryName
            }));
            if (merge) {
                setSubcategoryOptions(prev => [
                    ...prev,
                    ...subcategories.filter(sub => !prev.some(p => p.name === sub.name))
                ]);
            } else {
                setSubcategoryOptions(subcategories);
            }
        } else {
            console.log("Error fetching subcategories for", categoryName);
        }
    };
    const getSubcategoriesData = (categoryName, merge = false) => {
        const url = `${API_URLS.SUB_CATEGORIES}?categoryName=${categoryName}`;

        apiCall({
            method: 'GET',
            url,
            data: {},
            callback: (response) => getSubcategoriesCallback(response, categoryName, merge)
        });
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
    const getTemplateDataCallback = (response) => {
        if (response.status === 200) {
            const templateData = response.data.data;

            const selectedCategories = templateData.categories.map(c => c.name);
            const selectedSubcategories = templateData.sub_categories.map(s => s.name);
            // const selectedPlans = templateData.plans.map(p => p.name);
            // setSelectedPlan(selectedPlans);
            setSelectedCategory(selectedCategories);
            selectedCategories.forEach(cat => {
                getSubcategoriesData(cat, true);
            });

            setSelectedSubcategory(selectedSubcategories);
            // setIsMultiImageBanner(templateData.has_multiple_images || false);
            setHasBannerFooter(templateData.has_banner_footer || false);

            setPreviewImage(templateData.url);
        } else {
            const errorMsg = response?.data?.error || "Failed to fetch template data";
            toast.error(errorMsg, { position: "top-center", autoClose: 2000 });
        }
    };

    const editTemplateData = () => {
        if (!validateTemplateData()) return;
        console.log('selectedCategory: ', selectedCategory);
        console.log('selectedSubcategory: ', selectedSubcategory);

        const requestData = {
            // plans: selectedPlan.join(","),
            categories: selectedCategory.join(","),
            sub_categories: selectedSubcategory.join(","),
            has_banner_footer: hasBannerFooter
        };


        apiCall({
            method: "PUT",
            url: `${API_URLS.TEMPLATES}/${template_id}`,
            data: requestData,
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
                                {template_id ? (
                                    <>
                                        <label className="font-serif font-bold mb-1">PSD Preview</label>
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Template Preview"
                                                className="w-32 h-auto border rounded shadow-md mt-2"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No PSD available</span>
                                        )}
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                            {/* <label className="font-serif font-bold mb-1">Template Image</label>
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
                            )} */}
                        </div>
                        {/* {!template_id && (
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
                                isArray={true}


                            // error={errors.plan}
                            />)} */}
                        <DropdownComponent
                            label="Category"
                            options={categoriesData}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            dropdownClassName="w-[80%]"
                            error={errors.category}
                            isArray={true}

                        />

                        <DropdownComponent
                            label="Subcategory"
                            options={subcategoryOptions.map(sub => sub.name)}
                            value={selectedSubcategory}
                            // onChange={setSelectedSubcategory}
                            onChange={(value) => {
                                setSelectedSubcategory(value);
                                setErrors(prev => ({ ...prev, subcategory: "" }));
                            }}
                            dropdownClassName="w-[80%]"
                            error={errors.subcategory}
                            disabled={!selectedCategory.length}
                            isArray={true}

                        />
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                checked={hasBannerFooter}
                                onChange={(e) => setHasBannerFooter(e.target.checked)}
                            />
                            <label className="font-serif font-bold">
                                Has Banner Footer
                            </label>
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