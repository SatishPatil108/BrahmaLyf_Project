import { useState } from "react";
import { Mail, User, Calendar, CheckCircle, AlertCircle, Loader2, ArrowUpDown, X } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";
import CustomButton from "@/components/CustomButton";
import useInquiries from "./useInquiries";

const Inquiries = () => {
    const {
        loading,
        error,
        sortedInquiries,
        selectedInquiry,
        txtSubject,
        txtMessage,
        inquiriesDetails,
        pageNo,
        setPageNo,
        setSelectedInquiry,
        handleReply,
        handleSort,
        getArrow,
        isSubmitting,
        actionMessage,
        clearMessage
    } = useInquiries();

    const [localError, setLocalError] = useState(null);

    const validateReply = () => {
        if (!txtSubject.current?.value.trim()) {
            setLocalError("Subject is required");
            return false;
        }
        if (!txtMessage.current?.value.trim()) {
            setLocalError("Message is required");
            return false;
        }
        setLocalError(null);
        return true;
    };

    const handleReplyWithValidation = () => {
        if (validateReply()) {
            handleReply();
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Customer Inquiries
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage and respond to customer inquiries
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        actionMessage.type === 'success' 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                        {actionMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium ${
                                actionMessage.type === 'success' 
                                    ? 'text-green-700 dark:text-green-400' 
                                    : 'text-red-700 dark:text-red-400'
                            }`}>
                                {actionMessage.text}
                            </p>
                            {actionMessage.details && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {actionMessage.details}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={clearMessage}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-4">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            Loading inquiries...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Please wait while we fetch customer messages
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Failed to Load Inquiries
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            {error.message || "An error occurred while loading inquiries"}
                        </p>
                        <CustomButton 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </CustomButton>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && sortedInquiries.length > 0 && (
                    <>
                        <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            {[
                                                { key: "id", label: "ID" },
                                                { key: "user_id", label: "Registered" },
                                                { key: "name", label: "Name" },
                                                { key: "created_on", label: "Posted On" },
                                                { key: "replied_on", label: "Replied On" },
                                            ].map((col) => (
                                                <th
                                                    key={col.key}
                                                    className="p-4 cursor-pointer select-none font-semibold text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                                    onClick={() => handleSort(col.key)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-900 dark:text-gray-100">
                                                            {col.label}
                                                        </span>
                                                        <ArrowUpDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors ${
                                                            getArrow(col.key) === '↑' || getArrow(col.key) === '↓' 
                                                                ? 'text-indigo-600 dark:text-indigo-400' 
                                                                : ''
                                                        }`} />
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="p-4 font-semibold text-gray-900 dark:text-gray-100 text-left">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {sortedInquiries.map((inq, index) => (
                                            <tr
                                                key={inq.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                                #{inq.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        inq.user_id 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                        {inq.user_id ? "Registered" : "Guest"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                {inq.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {inq.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        <span>{inq.created_on}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {inq.replied_on ? (
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <span className="text-green-600 dark:text-green-500 font-medium">
                                                                {inq.replied_on}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                                                            Pending reply
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => setSelectedInquiry(inq)}
                                                        className={`font-medium transition-colors ${
                                                            inq.replied_on
                                                                ? 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                                : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
                                                        }`}
                                                    >
                                                        {inq.replied_on ? "View Details" : "Reply"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <Pagination
                                currentPage={pageNo}
                                totalPages={inquiriesDetails.total_pages || 1}
                                onPageChange={setPageNo}
                            />
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && sortedInquiries.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Mail className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No Inquiries Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            There are no customer inquiries to display at the moment.
                        </p>
                    </div>
                )}
            </div>

            {/* Inquiry Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 flex items-center justify-center 
                    bg-black/50 dark:bg-black/60 backdrop-blur-sm z-50 p-4">
                    
                    {/* Modal Box */}
                    <div className="bg-white dark:bg-gray-900 w-full max-w-4xl p-6 rounded-2xl shadow-2xl 
                        border border-gray-200 dark:border-gray-800 
                        max-h-[90vh] overflow-y-auto">
                        
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Inquiry Details
                                    </h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            ID: <span className="font-mono font-medium">#{selectedInquiry.id}</span>
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Posted: {selectedInquiry.created_on}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </button>
                        </div>

                        {/* User Status */}
                        <div className="mb-6">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                selectedInquiry.user_id 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                                {selectedInquiry.user_id ? "Registered User" : "Guest User"}
                            </div>
                        </div>

                        {/* 2-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* LEFT COLUMN */}
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                        Name
                                    </label>
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {selectedInquiry.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {selectedInquiry.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Original Message */}
                                <div>
                                    <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                        Original Message
                                    </label>
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {selectedInquiry.message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-5">
                                {/* Reply Status */}
                                {selectedInquiry.replied_on && (
                                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-green-800 dark:text-green-400">
                                                    Already Replied
                                                </p>
                                                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                                                    Replied on: {selectedInquiry.replied_on}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reply Subject */}
                                <div>
                                    <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                        Reply Subject *
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedInquiry.reply_subject || ""}
                                        readOnly={!!selectedInquiry.replied_on}
                                        ref={txtSubject}
                                        className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                                            placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                                            ${selectedInquiry.replied_on || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
                                            ${localError && !txtSubject.current?.value.trim() ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent'}`}
                                        placeholder="Enter reply subject"
                                    />
                                </div>

                                {/* Reply Message */}
                                <div>
                                    <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
                                        Reply Message *
                                    </label>
                                    <textarea
                                        rows={6}
                                        defaultValue={selectedInquiry.reply_message || ""}
                                        readOnly={!!selectedInquiry.replied_on}
                                        ref={txtMessage}
                                        className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                                            placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none
                                            ${selectedInquiry.replied_on || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
                                            ${localError && !txtMessage.current?.value.trim() ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent'}`}
                                        placeholder="Enter your reply message"
                                    />
                                </div>

                                {/* Validation Error */}
                                {localError && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {localError}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <CustomButton
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedInquiry(null)}
                                disabled={isSubmitting}
                            >
                                Close
                            </CustomButton>

                            {!selectedInquiry.replied_on ? (
                                <CustomButton
                                    variant="primary"
                                    onClick={handleReplyWithValidation}
                                    disabled={isSubmitting}
                                    className="min-w-[120px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reply
                                        </>
                                    )}
                                </CustomButton>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inquiries;