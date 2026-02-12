function TableComponent({
    headers,
    data,
    expandedRowIndex,
    onRowClick,
    maxHeight = "h-full",
}) {
    const unknownUserImage =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className={`w-full relative ${maxHeight} flex flex-col`}>
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-gray-200 rounded-t-lg px-5 py-3 flex text-sm font-semibold select-none">
                {headers.map((header, index) => (
                    <div
                        key={index}
                        className={`${header === "Actions" ? "flex-1 text-right" : "w-32"
                            }`}
                    >
                        {header}
                    </div>
                ))}
            </div>

            {/* ROWS container: scrollable only rows */}
            <div className="overflow-y-auto flex-1 space-y-3 mt-1">
                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer"
                        onClick={() => onRowClick && onRowClick(rowIndex)}
                    >
                        {/* MAIN ROW */}
                        {/* <div className="flex items-center px-5 py-4"> */}
                        <div
                            className={`flex items-center px-5 py-4
    ${expandedRowIndex === rowIndex ? "bg-gray-100" : "bg-white"}
  `}
                        >

                            {headers.map((key, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`${key === "Actions" ? "flex-1 text-right" : "w-32"
                                        }`}
                                >
                                    {key === "Profile" ? (
                                        <img
                                            src={row[key] || unknownUserImage}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        row[key]
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* EXPANDED ROW */}
                        {expandedRowIndex === rowIndex && (
                            <div className="bg-gray-100 px-6 py-4 text-sm grid grid-cols-4 gap-4 border-t">
                                <div>
                                    <strong>DOB:</strong>
                                    <div className="text-gray-700">{row["Dob"]}</div>
                                </div>

                                <div>
                                    <strong>Gender:</strong>
                                    <div className="text-gray-700">{row["Gender"]}</div>
                                </div>

                                <div>
                                    <strong>Firm Name:</strong>
                                    <div className="text-gray-700">{row["Firm Name"]}</div>
                                </div>

                                <div>
                                    <strong>Email:</strong>
                                    <div className="text-gray-700 break-all">{row["Email"]}</div>
                                </div>

                                {/* Full width field */}
                                <div className="col-span-4">
                                    <strong>Address:</strong>
                                    <div className="text-gray-700">{row["Address"]}</div>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

export default TableComponent;
