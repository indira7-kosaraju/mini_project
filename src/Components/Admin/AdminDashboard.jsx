import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, LogOut, Search } from 'lucide-react';
import {
    adminGetMembers,
    adminGetTrainers,
    adminUpdateMember,
    adminUpdateTrainer,
    adminDeleteMember,
    adminDeleteTrainer
} from '../../services/mockApi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            const [membersData, trainersData] = await Promise.all([
                adminGetMembers(),
                adminGetTrainers()
            ]);

            setMembers(membersData);
            setTrainers(trainersData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                if (type === 'member') {
                    await adminDeleteMember(id);
                    setMembers(members.filter(member => member._id !== id));
                } else {
                    await adminDeleteTrainer(id);
                    setTrainers(trainers.filter(trainer => trainer._id !== id));
                }
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(`Failed to delete ${type}`);
            }
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        
        if (currentUser.username) {
            try {
                const isTrainer = activeTab === 'trainers';
                if (isTrainer) {
                    const updated = await adminUpdateTrainer(currentUser._id, currentUser);
                    setTrainers(trainers.map(trainer =>
                        trainer._id === currentUser._id ? updated : trainer
                    ));
                } else {
                    const updated = await adminUpdateMember(currentUser._id, currentUser);
                    setMembers(members.map(member =>
                        member._id === currentUser._id ? updated : member
                    ));
                }

                setShowEditModal(false);
                toast.success('User updated successfully');
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value
        });
    };

    const filteredMembers = members.filter(member => 
        member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTrainers = trainers.filter(trainer => 
        trainer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/coupons')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Coupon
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <LogOut size={20} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'members' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Members
                    </button>
                    <button
                        onClick={() => setActiveTab('trainers')}
                        className={`px-4 py-2 font-medium transition-colors duration-200 ${
                            activeTab === 'trainers' 
                            ? 'text-orange-500 border-b-2 border-orange-500' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Trainers
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                {/* Members Table */}
                {activeTab === 'members' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Membership</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredMembers.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{member.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">{member.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                member.membership?.status === 'active' 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-500 text-white'
                                            }`}>
                                                {member.membership?.status || 'inactive'}
                                            </span>
                                            {member.membership?.type && (
                                                <span className="ml-2 text-gray-300">
                                                    {member.membership.type}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            <button 
                                                onClick={() => handleEdit(member)}
                                                className="text-blue-400 hover:text-blue-300 mr-3"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member._id, 'member')}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Trainers Table */}
                {activeTab === 'trainers' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Experience</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredTrainers.map((trainer) => (
                                    <tr key={trainer._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.specialization}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{trainer.experience} years</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{trainer.feePerMonth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            <button 
                                                onClick={() => handleEdit(trainer)}
                                                className="text-blue-400 hover:text-blue-300 mr-3"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(trainer._id, 'trainer')}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {showEditModal && currentUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Edit {activeTab === 'members' ? 'Member' : 'Trainer'}
                        </h2>
                        
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={currentUser.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={currentUser.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={currentUser.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            
                            {activeTab === 'members' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={currentUser.age}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={currentUser.gender}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={currentUser.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={currentUser.specialization}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Experience (years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={currentUser.experience}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Fee Per Month (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="feePerMonth"
                                            value={currentUser.feePerMonth}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;