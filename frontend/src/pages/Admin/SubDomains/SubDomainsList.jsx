import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FolderTree, Plus, SquarePen, Trash2, AlertCircle, CheckCircle, Loader2, ChevronLeft, Layers } from "lucide-react";
import useSubDomainsList from "./useSubDomainsList";
import CustomTable from "@/components/CustomTable";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

// Color configuration
const COLORS = {
  primary: {
    light: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    dark: { bg: "bg-indigo-900/20", text: "text-indigo-400", border: "border-indigo-800" },
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 to-purple-600"
  },
  danger: {
    light: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    dark: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-800" },
    icon: "text-red-600 dark:text-red-400"
  },
  success: {
    light: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    dark: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-800" },
    icon: "text-green-600 dark:text-green-400"
  },
  difficulty: {
    1: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Easy" },
    2: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Medium" },
    3: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Hard" }
  }
};

const SubDomainsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const domainName = location.state?.domainName || "Unknown Domain";
  const { domainId } = useParams();

  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 5);
  const {
    subdomainsDetails,
    loading,
    error,
    addSubDomain,
    updateSubDomain,
    deleteSubdomain,
    isSubmitting,
    actionMessage,
    clearMessage
  } = useSubDomainsList(pageNo, pageSize, domainId);

  const subdomains = subdomainsDetails.subdomains;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [subdomainName, setSubdomainName] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [editingSubdomain, setEditingSubdomain] = useState(null);
  const [subdomainThumbnail, setSubdomainThumbnail] = useState(null);
  const [subdomainThumbnailUrl, setSubdomainThumbnailUrl] = useState(null);
  const [errors, setErrors] = useState({});

  const columns = [
    { header: "ID", accessor: "subdomain_id" },
    { header: "Subdomain Name", accessor: "subdomain_name" },
    { header: "Difficulty Level", accessor: "progressive_difficulty" },
    { header: "Thumbnail", accessor: "subdomain_thumbnail" },
  ];

  const resetForm = () => {
    setIsDrawerOpen(false);
    setEditingSubdomain(null);
    setSubdomainName("");
    setDifficultyLevel("");
    setSubdomainThumbnail(null);
    setSubdomainThumbnailUrl(null);
    setErrors({});
    clearMessage();
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!subdomainName.trim()) {
      newErrors.subdomainName = "Subdomain name is required.";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(subdomainName)) {
      newErrors.subdomainName = "Name must only contain letters and spaces.";
      isValid = false;
    }

    if (!difficultyLevel) {
      newErrors.difficultyLevel = "Select the difficulty level.";
      isValid = false;
    }

    if (!subdomainThumbnail && !subdomainThumbnailUrl) {
      newErrors.subdomainThumbnail = "Subdomain thumbnail is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveSubdomain = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("domain_id", Number(domainId));
      formData.append("subdomain_name", subdomainName);
      formData.append("progressive_difficulty", difficultyLevel);
      if (subdomainThumbnail) {
        formData.append("subdomain_thumbnail", subdomainThumbnail);
      }

      if (editingSubdomain) {
        await updateSubDomain(editingSubdomain.subdomain_id, formData);
      } else {
        await addSubDomain(formData);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save subdomain:", error);
    }
  };

  const openDrawerForEdit = (subdomain) => {
    setEditingSubdomain(subdomain);
    setSubdomainName(subdomain.subdomain_name);
    setDifficultyLevel(subdomain.progressive_difficulty.toString());
    setSubdomainThumbnailUrl(subdomain.subdomain_thumbnail);
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleDeleteSubdomain = async (subdomain) => {
    if (window.confirm(`Delete "${subdomain.subdomain_name}"?`)) {
      await deleteSubdomain(subdomain.subdomain_id);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FolderTree className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Subdomains
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {domainName} • Manage learning categories
                </p>
              </div>
            </div>
          </div>

          <CustomButton
            onClick={() => {
              setIsDrawerOpen(true);
              setEditingSubdomain(null);
              setSubdomainName("");
              setDifficultyLevel("");
              setSubdomainThumbnailUrl(null);
              clearMessage();
            }}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Subdomain
          </CustomButton>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${actionMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${actionMessage.type === 'success'
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
              ✕
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
              Loading subdomains...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch categories
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
              Failed to Load Subdomains
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message || "An error occurred while loading subdomains"}
            </p>
            <CustomButton
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </CustomButton>
          </div>
        )}

        {/* Table Section */}
        {!loading && !error && subdomains.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <CustomTable
                columns={columns}
                data={subdomains.map(subdomain => ({
                  ...subdomain,
                  progressive_difficulty: (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${COLORS.difficulty[subdomain.progressive_difficulty]?.bg || 'bg-gray-100 dark:bg-gray-800'
                      } ${COLORS.difficulty[subdomain.progressive_difficulty]?.text || 'text-gray-700 dark:text-gray-300'
                      }`}>
                      {subdomain.progressive_difficulty} - {COLORS.difficulty[subdomain.progressive_difficulty]?.label || 'Unknown'}
                    </span>
                  )
                }))}
                onEdit={openDrawerForEdit}
                onDelete={(row) => handleDeleteSubdomain(row)}
                rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                actionButtons={(row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawerForEdit(row);
                      }}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                      title="Edit subdomain"
                    >
                      <SquarePen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubdomain(row);
                      }}
                      disabled={isSubmitting}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                      title="Delete subdomain"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                )}
              />
            </div>

            {subdomainsDetails.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pageNo}
                  totalPages={subdomainsDetails.total_pages}
                  onPageChange={setPageNo}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && subdomains.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
            <FolderTree className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Subdomains Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding learning categories for {domainName}
            </p>
            <CustomButton
              onClick={() => {
                setIsDrawerOpen(true);
                setEditingSubdomain(null);
                setSubdomainName("");
                setDifficultyLevel("");
                setSubdomainThumbnailUrl(null);
                clearMessage();
              }}
              variant="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Subdomain
            </CustomButton>
          </div>
        )}
      </div>

      {/* Add/Edit Subdomain Drawer */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={resetForm}
        title={editingSubdomain ? "Edit Subdomain" : "Add New Subdomain"}
        subtitle={editingSubdomain ? "Update category details below" : "Create a new learning category"}
      >
        <form
          className="space-y-6"
          onSubmit={handleSaveSubdomain}
        >
          {/* Subdomain Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
              Subdomain Name *
            </label>
            <input
              type="text"
              name="subdomainName"
              value={subdomainName}
              onChange={(e) => {
                setSubdomainName(e.target.value);
                if (errors.subdomainName) setErrors(prev => ({ ...prev, subdomainName: null }));
              }}
              placeholder="e.g., Frontend Development"
              className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                ${errors.subdomainName
                  ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                }`}
            />
            {errors.subdomainName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.subdomainName}
              </p>
            )}
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
              Difficulty Level *
            </label>
            <select
              name="difficultyLevel"
              value={difficultyLevel}
              onChange={(e) => {
                setDifficultyLevel(e.target.value);
                if (errors.difficultyLevel) setErrors(prev => ({ ...prev, difficultyLevel: null }));
              }}
              className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                ${errors.difficultyLevel
                  ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                }`}
            >
              <option value="">Select Difficulty Level</option>
              <option value="1">1 - Easy (Beginner)</option>
              <option value="2">2 - Medium (Intermediate)</option>
              <option value="3">3 - Hard (Advanced)</option>
            </select>
            {errors.difficultyLevel && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.difficultyLevel}
              </p>
            )}

            {difficultyLevel && (
              <div className={`mt-3 p-3 rounded-lg ${COLORS.difficulty[difficultyLevel]?.bg || 'bg-gray-100 dark:bg-gray-800'}`}>
                <p className={`text-sm font-medium ${COLORS.difficulty[difficultyLevel]?.text || 'text-gray-700 dark:text-gray-300'}`}>
                  {difficultyLevel === '1' && '✓ Suitable for beginners - Focus on fundamentals'}
                  {difficultyLevel === '2' && '✓ Intermediate level - Requires basic knowledge'}
                  {difficultyLevel === '3' && '✓ Advanced level - Requires experience and dedication'}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
              Subdomain Thumbnail *
            </label>
            <FileUploaderWithPreview
              key={editingSubdomain ? editingSubdomain.subdomain_id : "new"}
              imageFile={subdomainThumbnail}
              setImageFile={(file) => {
                setSubdomainThumbnail(file);
                if (errors.subdomainThumbnail) setErrors(prev => ({ ...prev, subdomainThumbnail: null }));
              }}
              imageUrl={subdomainThumbnailUrl}
              name="subdomainThumbnail"
              className={`${errors.subdomainThumbnail ? 'border-red-300 dark:border-red-700' : ''}`}
            />
            {errors.subdomainThumbnail && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.subdomainThumbnail}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Recommended size: 400×400px, Max size: 2MB
            </p>
          </div>

          {/* Form submission errors */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="sticky bottom-0 pt-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 -mx-4 px-4">
            <div className="flex justify-end gap-3">
              <CustomButton
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {editingSubdomain ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingSubdomain ? 'Update Subdomain' : 'Create Subdomain'}
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        </form>
      </CustomDrawer>
    </div>
  );
};

export default SubDomainsList;