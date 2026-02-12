import React, { useState } from "react";
import useDomainsList from "./useDomainsList";
import CustomTable from "@/components/CustomTable";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import { useNavigate } from "react-router-dom";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";
import { Plus, AlertCircle, CheckCircle, Loader2, FolderOpen } from "lucide-react";

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
  }
};

const DomainsList = () => {
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 5);
  const { domainsDetails, loading, error, addDomain, updateDomain, deleteDomain, isSubmitting, actionMessage, clearMessage } = useDomainsList(pageNo, pageSize);
  const domains = domainsDetails.domains;
  
  // drawer state and other
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [showSubDomains, setShowSubDomains] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [errors, setErrors] = useState({});

  // form state
  const [domainForm, setDomainForm] = useState({
    domainName: '',
    domainThumbnail: null
  });

  const resetForm = () => {
    setIsDrawerOpen(false);
    setEditingDomain(null);
    setDomainForm({
      domainName: '',
      domainThumbnail: null
    });
    setErrors({});
    clearMessage();
  };

  const navigate = useNavigate();

  const columns = [
    { header: "ID", accessor: "domain_id" },
    { header: "Domain Name", accessor: "domain_name" },
    { header: "Domain Thumbnail", accessor: "domain_thumbnail" },
  ];

  const openDrawerForEdit = (domain) => {
    setEditingDomain(domain);
    setDomainForm({
      domainName: domain.domain_name,
      domainThumbnail: domain.domain_thumbnail
    });
    setIsDrawerOpen(true);
    clearMessage();
  };

  const handleDomainClick = (domain) => {
    navigate(`/admin/domains/${domain.domain_id}/subdomains`, {
      state: { domainName: domain.domain_name },
    });
    setShowSubDomains(true);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (!domainForm.domainName.trim()) {
      newErrors.domainName = "Domain name is required.";
      isValid = false;
    } else if (!/^[a-zA-Z ]+$/.test(domainForm.domainName)) {
      newErrors.domainName = "Name must only contain letters.";
      isValid = false;
    }

    if (!domainForm.domainThumbnail) {
      newErrors.domainThumbnail = "Domain thumbnail is required.";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSaveDomain = async (e) => {
    e.preventDefault();
    clearMessage();
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("domain_name", domainForm.domainName);
    if (typeof domainForm.domainThumbnail == "object") {
      formData.append("domain_thumbnail", domainForm.domainThumbnail);
    }

    try {
      if (editingDomain) {
        await updateDomain(editingDomain.domain_id, formData);
      } else {
        await addDomain(formData);
      }
      
      resetForm();
    } catch (err) {
      // Error is handled in the useDomainsList hook
    }
  };

  const handleDeleteDomain = async (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.domain_name}"?`)) {
      await deleteDomain(row.domain_id);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Learning Domains
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage all learning domains and their categories
              </p>
            </div>
          </div>
          
          <CustomButton
            onClick={() => {
              setIsDrawerOpen(true);
              setEditingDomain(null);
              setDomainForm({
                domainName: "",
                domainThumbnail: null
              });
              clearMessage();
            }}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Domain
          </CustomButton>
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
            <div>
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
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Loading domains...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Failed to Load Domains
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
              {error.message || "An error occurred while loading domains"}
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
        {!loading && !error && domains && (
          <>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <CustomTable
                columns={columns}
                data={domains}
                onEdit={openDrawerForEdit}
                onRowClick={handleDomainClick}
                onDelete={handleDeleteDomain}
                rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
              />
            </div>
            
            {domainsDetails.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pageNo}
                  totalPages={domainsDetails.total_pages}
                  onPageChange={setPageNo}
                />
              </div>
            )}
            
            {domains.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
                <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Domains Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Get started by adding your first learning domain
                </p>
                <CustomButton
                  onClick={() => setIsDrawerOpen(true)}
                  variant="primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Domain
                </CustomButton>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Domain Drawer */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={resetForm}
        title={editingDomain ? "Edit Domain" : "Add New Domain"}
        subtitle={editingDomain ? "Update domain details below" : "Create a new learning domain"}
      >
        <form
          className="space-y-6 max-h-[85vh] px-2 sm:px-4"
          onSubmit={handleSaveDomain}
        >
          {/* Domain Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-100">
              Domain Name *
            </label>
            <input
              type="text"
              name="domainName"
              value={domainForm.domainName}
              onChange={(e) => {
                setDomainForm(prev => ({ ...prev, domainName: e.target.value }));
                if (errors.domainName) setErrors(prev => ({ ...prev, domainName: null }));
              }}
              placeholder="e.g., Web Development"
              className={`w-full px-4 py-3 rounded-lg border shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                ${errors.domainName
                  ? "border-red-300 dark:border-red-700 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-transparent"
                }`}
            />
            {errors.domainName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.domainName}
              </p>
            )}
          </div>

          {/* Upload Thumbnail */}
          <div>
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-100">
              Domain Thumbnail *
            </label>
            <FileUploaderWithPreview
              key={editingDomain ? editingDomain.domain_id : "new"}
              imageFile={typeof domainForm.domainThumbnail == "object" ? domainForm.domainThumbnail : null}
              setImageFile={(file) => {
                setDomainForm(prev => ({ ...prev, domainThumbnail: file }));
                if (errors.domainThumbnail) setErrors(prev => ({ ...prev, domainThumbnail: null }));
              }}
              imageUrl={typeof domainForm.domainThumbnail == "string" ? domainForm.domainThumbnail : null}
              name="domainThumbnail"
              className={`${errors.domainThumbnail ? 'border-red-300 dark:border-red-700' : ''}`}
            />
            {errors.domainThumbnail && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.domainThumbnail}
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
                    {editingDomain ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingDomain ? 'Update Domain' : 'Create Domain'}
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

export default DomainsList;