
import PrimaryButtonComponent from "../PrimaryButtonComponent/PrimaryButtonComponent";

export default function CustomConfirmationPopup({
    handleCancelButton,
    handleDeleteButton,
    label
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg w-[40%] rounded-[10px]">
                <div className="text-lg py-2 pl-5 font-bold bg-slate-900 text-white font-serif rounded-t-[10px]">
                    Confirmation
                </div>

                <div className="p-5">
                    <div className="font-semibold mb-5 text-[18px]">
                        {label}
                    </div>

                    <div className="flex justify-end gap-3">
                        <PrimaryButtonComponent
                            label="Cancel"
                            buttonClassName="border border-slate-900 !text-black bg-transparent hover:bg-slate-900 hover:!text-white"
                            onClick={handleCancelButton}
                        />
                        <PrimaryButtonComponent
                            label="Delete"
                            icon="fa fa-trash"
                            buttonClassName="border border-red-500 text-white !text-red-500 bg-transparent hover:bg-red-500 hover:!text-white"
                            onClick={handleDeleteButton}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}