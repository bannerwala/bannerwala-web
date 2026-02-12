import React, { useEffect, useState } from "react";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import TableComponent from "../../CustomComponents/TableComponent/TableComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import { API_URLS } from "../../Utils/AppConst";
import { USERS_COLUMNS } from "./Constants";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState("")
    const [loading, setLoading] = useState(false);
    const getUsersCallback = (response) => {
        if (response.status === 200) {
            const usersFormattedRows = response.data.map((user) => ({
                "Profile": user.profile_pic,
                "Email": user.email_id,
                "Name": user.name,
                // "Email": user.email_id,
                "Contact No": user.contact_number,
                "Role": user.role,
                // "Plan": user.subscription_details,
                "Firm Name": user.firm_name,
                "Gender": user.gender,
                "Dob": user.DOB,
                "Address": user.address,
                "Designation": user.designation,
                id: user.id
            }));
            setUsers(usersFormattedRows);
        } else {
            console.error("Failed to fetch users", response);
        }
    };
    const getUsers = () => {
        apiCall({
            method: "GET",
            url: API_URLS.USERS,
            data: {},
            callback: getUsersCallback,
            setLoading: setLoading
        });
    };
    useEffect(() => {
        getUsers();
    }, []);
    const handleRowClick = (index) => {
        setExpandedRowIndex(expandedIndex => expandedIndex === index ? "" : index);
    };
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <div className="text-xl font-serif mb-3">Users List</div>
                <TableComponent
                    headers={USERS_COLUMNS}
                    data={users}
                    expandedRowIndex={expandedRowIndex}
                    onRowClick={handleRowClick}
                    maxHeight="h-[84vh]"
                />
            </div>
        </div>

    );
}

export default UsersList;
