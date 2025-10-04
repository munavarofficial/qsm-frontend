import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, BookOpen, Award, FileText, CreditCard } from 'lucide-react';

function TeacherProfileTchr() {
    const [teacher, setTeacher] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const storedTeacher = localStorage.getItem('teacher');
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        }
    }, []);

    if (!teacher) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Teacher Details Found</h3>
                    <p className="text-gray-600">Please check your connection and try again.</p>
                </div>
            </div>
        );
    }

    const InfoCard = ({ icon: Icon, title, children }) => (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const InfoItem = ({ label, value, icon: Icon }) => (
        <div className="flex items-start space-x-3">
            {Icon && <Icon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />}
            <div className="flex-grow">
                <span className="text-sm font-medium text-gray-600">{label}:</span>
                <p className="text-gray-800 font-medium mt-1">{value || 'N/A'}</p>
            </div>
        </div>
    );
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                        <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                            <div className="relative">
                                {teacher.image ? (
                                    <img
                                        src={getImageUrl(teacher.image)}
                                        alt={`${teacher.name}'s profile`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                </div>
                            </div>
                            <div className="text-center md:text-left flex-grow">
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{teacher.name}</h1>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-100 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-lg ">{teacher.place}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <span className="text-sm font-medium text-green-950">MSR: {teacher.msr_no}</span>
                                    </div>
                                    <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <span className="text-sm font-medium text-green-950">Joined: {teacher.joined_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <InfoCard icon={User} title="Personal Information">
                        <InfoItem label="Father's Name" value={teacher.father_name} />
                        <InfoItem label="Date of Birth" value={teacher.dob} icon={Calendar} />
                        <InfoItem label="Blood Group" value={teacher.blood_grp} />
                        <InfoItem label="Phone" value={teacher.phone_no} icon={Phone} />
                        <InfoItem label="Email" value={teacher.email} icon={Mail} />
                    </InfoCard>

                    {/* Professional Information */}
                    <InfoCard icon={Award} title="Professional Information">
                        <InfoItem label="Salary" value={`₹${teacher.salary}`} icon={CreditCard} />
                        <InfoItem label="Registration No" value={teacher.reg_no} icon={FileText} />
                        <InfoItem label="Islamic Qualification" value={teacher.islamic_qualification} icon={BookOpen} />
                        <InfoItem label="Academic Qualification" value={teacher.academic_qualification} icon={BookOpen} />
                        <InfoItem label="Other Occupation" value={teacher.other_occupation} />
                    </InfoCard>

                    {/* Additional Information */}
                    <InfoCard icon={FileText} title="Additional Information">
                        <InfoItem label="Aadhaar No" value={teacher.aadhaar_no} />
                        <InfoItem label="Address" value={teacher.address} icon={MapPin} />
                    </InfoCard>


                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <div className="bg-white rounded-xl shadow-md p-4 inline-block">
                        <p className="text-sm text-gray-500">
                            Profile last updated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherProfileTchr;