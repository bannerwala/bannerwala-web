import React, { useEffect, useState } from "react";
import DashboardSideBar from "../DashboardSideBar/DashboardSideBar";
import TableComponent from "../../CustomComponents/TableComponent/TableComponent";
import { apiCall, Spinner } from "../../Utils/AxiosUtils";
import HeaderComponents from "../../CustomComponents/HeaderComponents/HeaderComponents";
import { API_URLS } from "../../Utils/AppConst";
import { USERS_COLUMNS } from "./Constants";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponents from "../../CustomComponents/InputComponents/InputComponents";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState("")
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [role, setRole] = useState('');
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
        // let url = API_URLS.USERS;
        let url = `${API_URLS.USERS}?`;
        if (userName) {
            url += `&name=${userName}`
        }
        if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        if (role) {
            url += `&role=${role}`
        }

        apiCall({
            method: "GET",
            url: url,
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
    const handleSearchFilter = () => {
        getUsers({ userName, contactNo, role });
    }
    const handleResetFilter = () => {
        setUserName('');
        setContactNo('');
        setRole('');
        getUsers();

    }
    return (
        <div className="min-h-screen flex">
            <DashboardSideBar />
            {loading && <Spinner />}
            <div className="w-full p-4">
                <div className="text-xl font-serif mb-3">Users List</div>
                <div className="flex items-center gap-4 mb-5">
                    <InputComponents
                        type="text"
                        placeholder="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        inputClassName="w-[190px]"
                    />
                    <InputComponents
                        type="text"
                        placeholder="Contact No"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        inputClassName="w-[190px]"
                        maxLength={10}
                        numericOnly={true}
                    />
                    <InputComponents
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        inputClassName="w-[190px]"
                    />
                    <PrimaryButtonComponent
                        label="Search"
                        icon="fa fa-search"
                        buttonClassName="mt-5 py-1 px-5"
                        onClick={handleSearchFilter}
                    />
                    <PrimaryButtonComponent
                        label="Reset"
                        icon="fa fa-refresh"
                        buttonClassName="mt-5 py-1 px-5"
                        onClick={handleResetFilter}
                    />
                </div>
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
