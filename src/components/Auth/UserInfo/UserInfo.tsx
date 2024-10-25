"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "../../ui/scroll-area";
import {
  MapPin,
  Calendar,
  User,
  Key,
  Clock,
  ShieldAlert,
  Mail,
  Edit,
  Trash2,
} from "lucide-react";

import Lottie from "lottie-react";
import animatedBg from "./Lottie/animatedBg.json";

interface IUserDetails {
  email: string;
  userId: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  address1: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  city: string;
  state: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

const UserInfo = ({ info }: { info: IUserDetails }) => {
  return (
    <div className="relative w-full h-screen p-8 mx-auto text-gray-900 font-sans overflow-hidden">
      {/* Lottie Background Animation */}
      {/* <Lottie
        animationData={animatedBg}
        loop
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ opacity: 0.1 }} // Adjust opacity to make it subtle
      /> */}

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="flex justify-between items-start mb-8">
          {/* User Image and Name */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.img
              src={`https://ui-avatars.com/api/?name=${info.firstName}+${info.lastName}&background=0D8ABC&color=fff&rounded=true`}
              alt={`${info.firstName} ${info.lastName}`}
              className="w-20 h-20 rounded-full shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold capitalize">
                {info.firstName} {info.lastName}
              </h2>
              <p className="text-lg text-gray-600">{info.email}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="flex space-x-4">
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* User Details */}
        <ScrollArea className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Section */}
            <div className="flex items-start space-x-2">
              <MapPin className="text-blue-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-600">
                  {info.address1}, {info.city}, {info.state} {info.postalCode}
                </p>
              </div>
            </div>

            {/* Date of Birth Section */}
            <div className="flex items-start space-x-2">
              <Calendar className="text-yellow-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">Date of Birth:</p>
                <p className="text-gray-600">
                  {new Date(info.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Account Created Section */}
            <div className="flex items-start space-x-2">
              <Clock className="text-indigo-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">Account Created:</p>
                <p className="text-gray-600">
                  {new Date(info.$createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Dwolla Customer ID */}
            <div className="flex items-start space-x-2">
              <Key className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">
                  Dwolla Customer ID:
                </p>
                <p className="text-gray-600">{info.dwollaCustomerId}</p>
              </div>
            </div>

            {/* SSN Section */}
            <div className="flex items-start space-x-2">
              <ShieldAlert className="text-red-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">SSN:</p>
                <p className="text-gray-600">{info.ssn}</p>
              </div>
            </div>

            {/* Permissions */}
            <div className="flex items-start space-x-2">
              <User className="text-purple-500 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">Permissions:</p>
                {info.$permissions.length > 0 ? (
                  <ul className="text-gray-600 list-disc pl-4">
                    {info.$permissions.map((permission, index) => (
                      <li key={index}>{permission}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No permissions available
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UserInfo;
