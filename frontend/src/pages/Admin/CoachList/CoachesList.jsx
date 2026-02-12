import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useCoachesList from "./useCoachesList";
import {
  deleteCoachAPI,
  fetchAllSubDomainsAPI,
} from "@/store/feature/admin";
import CustomButton from "@/components/CustomButton";
import CustomDrawer from "@/components/CustomDrawer";
import CoachInfo from "./CoachInfo";
import FileUploaderWithPreview from "@/components/FileUploaderWithPreview/FileUploaderWithPreview";
import { SquarePen, Trash2, UserPlus, AlertCircle } from "lucide-react";
import usePagination from "@/hooks";
import Pagination from "@/components/Pagination/Pagination";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CoachesList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1, 5);
  const { coachesDetails, loading, error, domainsDetails, subdomainsDetails, addNewCoach, updateCoachDetails, deleteCoach } = useCoachesList(pageNo, pageSize);

  const coaches = coachesDetails.coaches || [];
  const domains = domainsDetails.domains || [];
  const subdomains = subdomainsDetails.subdomains || [];

  // drawer and other state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [touched, setTouched] = useState({});

  // Form states
  const [coachForm, setCoachForm] = useState({
    name: '',
    email: '',
    contactNumber: '',
    experience: '',
    domainId: '',
    subdomainId: '',
    professionalTitle: '',
    bio: '',
    profilePicture: null
  })

  // Clear API errors when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setApiError(null);
    }
  }, [isDrawerOpen]);
  useEffect(() => {
    if (location.state && location.state.mode === 'create') {
      handleAddCoach();
    }
  }, [location.state]);
  // handle change 
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "domainId") {
      const selectedDomainId = value;
      if (selectedDomainId) {
        dispatch(fetchAllSubDomainsAPI({ domainId: selectedDomainId, pageNo: 1, pageSize: '*' }));
      }
      // Clear subdomain when domain changes
      setCoachForm(prev => ({
        ...prev,
        [name]: value,
        subdomainId: ''
      }));
    } else {
      setCoachForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (formErrors[name] && touched[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear API error when user interacts with form
    if (apiError) {
      setApiError(null);
    }
  }

  const resetForm = () => {
    setCoachForm({
      name: '',
      email: '',
      contactNumber: '',
      experience: '',
      domainId: '',
      subdomainId: '',
      professionalTitle: '',
      bio: '',
      profilePicture: null
    });
    setFormErrors({});
    setApiError(null);
    setTouched({});
    setEditingCoach(false);
    setShowForm(false);
    setIsDrawerOpen(false);
  };

  const handleAddCoach = () => {
    setEditingCoach(false);
    setShowForm(true);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (coach) => {
    setSelectedCoach(coach);
    setEditingCoach(coach);
    setShowForm(false);
    setIsDrawerOpen(true);
  };

  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    setCoachForm({
      name: coach.name,
      email: coach.email,
      contactNumber: coach.contact_number,
      experience: coach.experience,
      domainId: coach.domain_id,
      subdomainId: coach.subdomain_id,
      professionalTitle: coach.professional_title,
      bio: coach.bio,
      profilePicture: coach.profile_image_url,
    });
    setFormErrors({});
    setApiError(null);
    setTouched({});
    setShowForm(true);

    if (coach.domain_id) {
      dispatch(fetchAllSubDomainsAPI({ domainId: coach.domain_id }));
    }

    setIsDrawerOpen(true);
  };

  const handleDeleteCoach = (coachId) => {
    if (window.confirm("Are you sure you want to delete this coach? This action cannot be undone.")) {
      deleteCoach(coachId);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!coachForm.name.trim()) {
      errors.name = "Coach name is required";
    }

    if (!coachForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coachForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!coachForm.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(coachForm.contactNumber)) {
      errors.contactNumber = "Contact number must be exactly 10 digits";
    }

    if (!coachForm.experience) {
      errors.experience = "Experience is required";
    } else if (isNaN(coachForm.experience) || parseInt(coachForm.experience) < 0) {
      errors.experience = "Experience must be a valid number";
    }

    if (!coachForm.professionalTitle.trim()) {
      errors.professionalTitle = "Professional title is required";
    }

    if (!coachForm.domainId) {
      errors.domainId = "Please select a domain";
    }

    if (!coachForm.subdomainId) {
      errors.subdomainId = "Please select a subdomain";
    }

    if (!coachForm.bio.trim()) {
      errors.bio = "Coach bio is required";
    } else if (coachForm.bio.trim().length < 50) {
      errors.bio = "Bio should be at least 50 characters";
    }

    if (!coachForm.profilePicture) {
      errors.profilePicture = "Profile picture is required";
    }

    return errors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errors = validateForm();
    if (errors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: errors[field] }));
    }
  };

  const handleSaveCoach = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFieldsTouched = {
      name: true,
      email: true,
      contactNumber: true,
      experience: true,
      professionalTitle: true,
      domainId: true,
      subdomainId: true,
      bio: true,
      profilePicture: true
    };
    setTouched(allFieldsTouched);

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    const formData = new FormData();
    formData.append("name", coachForm.name.trim());
    formData.append("email", coachForm.email.trim());
    formData.append("contact_number", coachForm.contactNumber.trim());
    formData.append("experience", coachForm.experience);
    formData.append("domain_id", coachForm.domainId);
    formData.append("subdomain_id", coachForm.subdomainId);
    formData.append("professional_title", coachForm.professionalTitle.trim());
    formData.append("bio", coachForm.bio.trim());
    if (typeof coachForm.profilePicture === "object") {
      formData.append("profile_picture", coachForm.profilePicture);
    }

    try {
      if (editingCoach && typeof editingCoach === 'object') {
        await updateCoachDetails(editingCoach.coach_id, formData);
      } else {
        await addNewCoach(formData);
      }
      resetForm();
    } catch (err) {
      setApiError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Coaches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and oversee all coaching professionals
          </p>
        </div>
        <CustomButton
          onClick={handleAddCoach}
          variant="primary"
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Coach
        </CustomButton>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                Failed to load coaches
              </p>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                {error.message || "Please try again later"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Coaches List */}
      {!loading && !error && coaches.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {coaches.map((coach) => (
              <div
                key={coach.coach_id}
                className="relative flex flex-col lg:flex-row bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => handleRowClick(coach)}
              >
                {/* Coach Image */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6 flex justify-center lg:justify-start">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800">
                    <img
                      src={`${BASE_URL}${coach.profile_image_url}`}
                      alt={coach.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(coach.name) + '&background=indigo&color=fff';
                        e.target.className = 'w-full h-full object-contain bg-gray-100 dark:bg-gray-800 p-2';
                      }}
                    />
                  </div>
                </div>

                {/* Coach Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {coach.name}
                    </h2>
                    {/* <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 font-medium">
                      ID: {coach.coach_id}
                    </span> */}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">
                    {coach.professional_title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    <span className="font-medium">Email:</span> {coach.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <span className="font-medium">Contact:</span> {coach.contact_number}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {coach.experience} years experience
                    </span>
                    {coach.domain_name && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                        {coach.domain_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCoach(coach);
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Edit coach"
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCoach(coach.coach_id);
                    }}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Delete coach"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={pageNo}
              totalPages={coachesDetails.total_pages || 1}
              onPageChange={(page) => setPageNo(page)}
              currentPageSize={pageSize}
              onPageSizeChange={(pageSize) => setPageSize(pageSize)}
              showInfo={true}
              showPageSize={false}
              pageSizeOptions={[5, 10, 15, 20]}
              size="large"
            />
          </div>
        </>
      ) : (
        !loading &&
        !error && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Coaches Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first coach.
            </p>
            <CustomButton onClick={handleAddCoach} variant="primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Add First Coach
            </CustomButton>
          </div>
        )
      )}

      {/* Drawer for Add/Edit/View */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={resetForm}
        title={showForm ? (editingCoach ? "Edit Coach" : "Add New Coach") : "Coach Details"}
        footer={
          showForm ? (
            <div className="flex gap-3">
              <CustomButton
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handleSaveCoach}
              >
                {editingCoach ? 'Update Coach' : 'Save Coach'}
              </CustomButton>
            </div>
          ) : null
        }
      >
        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {apiError}
              </p>
            </div>
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSaveCoach} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coach Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={coachForm.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.name && touched.name
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="Enter coach's full name"
                />
                {formErrors.name && touched.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={coachForm.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.email && touched.email
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="coach@example.com"
                />
                {formErrors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={coachForm.contactNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur('contactNumber')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.contactNumber && touched.contactNumber
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="10-digit phone number"
                />
                {formErrors.contactNumber && touched.contactNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.contactNumber}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={coachForm.experience}
                  onChange={handleChange}
                  onBlur={() => handleBlur('experience')}
                  min="0"
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.experience && touched.experience
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="Years of experience"
                />
                {formErrors.experience && touched.experience && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.experience}
                  </p>
                )}
              </div>

              {/* Professional Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="professionalTitle"
                  value={coachForm.professionalTitle}
                  onChange={handleChange}
                  onBlur={() => handleBlur('professionalTitle')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.professionalTitle && touched.professionalTitle
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="e.g., Senior Life Coach"
                />
                {formErrors.professionalTitle && touched.professionalTitle && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.professionalTitle}
                  </p>
                )}
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Domain
                </label>
                <select
                  name="domainId"
                  value={coachForm.domainId}
                  onChange={handleChange}
                  onBlur={() => handleBlur('domainId')}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.domainId && touched.domainId
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  <option value="">Select Domain</option>
                  {domains.map((d) => (
                    <option key={d.domain_id} value={d.domain_id}>
                      {d.domain_name}
                    </option>
                  ))}
                </select>
                {formErrors.domainId && touched.domainId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.domainId}
                  </p>
                )}
              </div>

              {/* Subdomain */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Subdomain
                </label>
                <select
                  name="subdomainId"
                  value={coachForm.subdomainId}
                  onChange={handleChange}
                  onBlur={() => handleBlur('subdomainId')}
                  disabled={!coachForm.domainId || subdomains.length === 0}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.subdomainId && touched.subdomainId
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    ${!coachForm.domainId ? 'opacity-60 cursor-not-allowed' : ''}
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  <option value="">Select Subdomain</option>
                  {subdomains.map((s) => (
                    <option key={s.subdomain_id} value={s.subdomain_id}>
                      {s.subdomain_name}
                    </option>
                  ))}
                </select>
                {formErrors.subdomainId && touched.subdomainId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.subdomainId}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Biography
                </label>
                <textarea
                  name="bio"
                  value={coachForm.bio}
                  onChange={handleChange}
                  onBlur={() => handleBlur('bio')}
                  rows={4}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border text-sm resize-none
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${formErrors.bio && touched.bio
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  `}
                  placeholder="Tell us about the coach's background, expertise, and achievements..."
                />
                {formErrors.bio && touched.bio && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.bio}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 50 characters. Current: {coachForm.bio.length}
                </p>
              </div>

              {/* Profile Picture */}
              <div className="lg:col-span-2 mb-16">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Profile Picture
                </label>
                <FileUploaderWithPreview
                  imageFile={typeof coachForm.profilePicture === "object" ? coachForm.profilePicture : null}
                  imageUrl={typeof coachForm.profilePicture === "string" ? coachForm.profilePicture : null}
                  setImageFile={(file) => {
                    setCoachForm(prev => ({ ...prev, profilePicture: file }));
                    if (formErrors.profilePicture && touched.profilePicture) {
                      setFormErrors(prev => ({ ...prev, profilePicture: '' }));
                    }
                  }}
                  name="profilePicture"
                  label="Upload coach profile picture"
                  required={true}
                />
                {formErrors.profilePicture && touched.profilePicture && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.profilePicture}
                  </p>
                )}
              </div>
            </div>
          </form>
        ) : (
          <CoachInfo coach={selectedCoach} />
        )}
      </CustomDrawer>
    </div>
  );
};

export default CoachesList;