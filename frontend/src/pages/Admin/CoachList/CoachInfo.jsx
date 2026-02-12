import React from "react";
import { Mail, Phone, Award, User, Calendar, Briefcase, FileText, Award as Trophy } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CoachInfo = ({ coach }) => {
  if (!coach) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Coach Selected
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a coach from the list to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            <img
              src={coach.profile_image_url ? `${BASE_URL}${coach.profile_image_url}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(coach.name) + '&background=indigo&color=fff'}
              alt={coach.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(coach.name) + '&background=indigo&color=fff';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Name and Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {coach.name}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              {coach.professional_title}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ID: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{coach.coach_id}</code>
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </h4>
            </div>
          </div>
          <p className="text-gray-900 dark:text-gray-100 text-sm font-medium break-all">
            {coach.email}
          </p>
        </div>

        {/* Phone */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contact Number
              </h4>
            </div>
          </div>
          <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
            {coach.contact_number}
          </p>
        </div>

        {/* Experience */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Experience
              </h4>
            </div>
          </div>
          <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
            {coach.experience} years
          </p>
        </div>

        {/* Domain */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Specialization
              </h4>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
              {coach.domain_name || "Not specified"}
            </p>
            {coach.subdomain_name && (
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {coach.subdomain_name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Biography
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional background and expertise
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
          {coach.bio ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {coach.bio}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No biography available for this coach
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        {coach.bio && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Words: {coach.bio.split(/\s+/).length}</span>
              <span>Characters: {coach.bio.length}</span>
              <span>Last updated: {coach.updated_at ? new Date(coach.updated_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Status
          </h4>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            coach.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {coach.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Registration Date */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Registration Date
          </h4>
          <p className="text-gray-900 dark:text-gray-100 text-sm">
            {coach.created_at ? new Date(coach.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Coach ID: {coach.coach_id} • Last updated: {coach.updated_at ? new Date(coach.updated_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default CoachInfo;