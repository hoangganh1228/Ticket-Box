'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from "next/navigation";
import {getDetailUser, updateUser} from "@/src/apis/users";
import {UserDetail} from "@/src/utils/interfaces/user.interface";
import {toast} from "react-toastify";
import {getErrorMessage} from "@/src/helpers/toastError.helper";


export default function UserEditForm() {
    const {id} = useParams()
    const [isLoading, setIsLoading] = useState({
        loadingGetData: false,
        loadingUpdateData: false,
    });
    const [user, setUser] = useState<UserDetail>({
        createdAt: new Date(),
        email: "",
        id: 0,
        roles: [],
        updatedAt: new Date(),
    });
    const router = useRouter();
    const getUserData = async () => {
        try {
            setIsLoading(prev => ({...prev, loadingGetData: true}));
            const {data} = await getDetailUser(Number(id));
            setUser(data);
            setIsLoading(prev => ({...prev, loadingGetData: false}));
        } catch (error) {
            setIsLoading(prev => ({...prev, loadingGetData: false}));
            console.error('Error fetching user data:', error);
            toast.error(getErrorMessage(error, 'Failed to fetch user data'));
        }
    }
    useEffect(() => {
        getUserData()
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                email: user.email,
            }
            setIsLoading(prev => ({...prev, loadingUpdateData: true}));
            await updateUser(Number(id), payload);
            toast.success('User updated successfully');
            setIsLoading(prev => ({...prev, loadingUpdateData: false}));
            router.push('/')
        } catch (error) {
            setIsLoading(prev => ({...prev, loadingUpdateData: false}));
            console.error('Error updating user:', error);
            toast.error(getErrorMessage(error, 'Failed to update user'));
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label htmlFor="email" className="block font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading.loadingUpdateData}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 cursor-pointer"
                >
                    {isLoading.loadingUpdateData ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            <span>Loading...</span>
                        </div>
                    ) : (
                        'Save Changes'
                    )}

                </button>
            </form>
        </div>
    );
}
