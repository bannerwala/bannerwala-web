import axios from "axios";
export const apiCall = async ({ method, url, data, callback, setLoading }) => {
    console.log('method, url, data: ', method, url, data);
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    try {
        const response = await axios({
            method, url, data,
            headers: token && !url.includes("/login")
                ? { Authorization: `Bearer ${token}` }
                : {},
        });
        callback(response);
        console.log('response:', response);
    } catch (error) {
        console.error("ERROR:", error);
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/";
        }
        // callback(error.response);
        if (error.response) {
            callback(error.response);
        }
    }
    finally {
        if (setLoading) setLoading(false);
    }
};
export const Spinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="relative w-10 h-10">
            <div className="absolute inset-2 rounded-full border-4 border-gray-600 border-b-transparent animate-spin"></div>
        </div>
    </div>
);  