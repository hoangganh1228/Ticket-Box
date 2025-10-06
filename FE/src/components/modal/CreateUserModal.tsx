import {FormEvent, useState} from "react";
import {toast} from "react-toastify";
import {createUser} from "@/src/apis/users";
import {useKeyPress} from "@/src/hooks/useKeyPress";
import {getErrorMessage} from "@/src/helpers/toastError.helper";

export default function CreateUserModal({onClose, setUsersList}: {
    onClose: () => void;
    setUsersList: (users: (prev: never) => any[]) => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!email) {
                toast.warning("please enter email");
                return;
            }
            if (!password) {
                toast.warning("please enter password");
                return;
            }
            const payload = {
                email,
                password,
            }
            setLoading(true)
            const dataCreated = await createUser(payload);
            setUsersList((prev: never) => [...prev, dataCreated.data]);

            toast.success("User created successfully");
            setEmail("");
            setPassword("");
            setLoading(false);
            onClose();

        } catch (error) {
            setLoading(false);
            console.error("Error creating user:", error);
            toast.error(getErrorMessage(error, "An error occurred while creating user."))
        }
    }
    useKeyPress("Escape", onClose);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all scale-95">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create User
                </h2>

                <form className="space-y-5" onSubmit={handleCreateUser}>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                            </div>
                        ) : (
                            'Create'
                        )}

                    </button>
                </form>
            </div>
        </div>
    );
}
