import React, { useState, useEffect, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import {
    AlertCircle, CheckCircle, Clapperboard,
    Eye, Flame, Plus, MoreVertical,
    X, ChevronDown, Sparkles,
    Music,
    Video,
} from 'lucide-react';
import CustomDrawer from '@/components/CustomDrawer';
import FileUploaderWithPreview from '@/components/FileUploaderWithPreview/FileUploaderWithPreview';
import YouTubeUrlInput from '@/components/videoUrlValidator/YouTubeUrlInput';
import useDailyShortList from './useDailyShortList';
import useDomainData from '../CourseList/useDomainData';
import usePagination from '@/hooks';
import DailyShortCard from './DailyShortCard';



// ── Stat Card ──
const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    </div>
);

// ── Main ShortsList ──
const ShortsList = () => {
    const { pageNo, pageSize, setPageNo } = usePagination(1, 10);

    const {
        shortVideosDetails,
        loading,
        error,
        addVideo,
        updateShortVideoDetails,
        deleteShortVideo,
        isSubmitting,
        actionMessage,
        clearMessage,
    } = useDailyShortList(pageNo, pageSize);

    const videos = shortVideosDetails?.videos ?? [];
    const { domainsDetails } = useDomainData(1, 10);
    const domains = (domainsDetails?.domains ?? []).map(({ domain_id, domain_name }) => ({ domain_id, domain_name }));

    const [currentPlaying, setCurrentPlaying] = useState(null);
    const [activeDomainId, setActiveDomainId] = useState('all');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingShortId, setEditingShortId] = useState(null);
    const [shortName, setShortName] = useState('');
    const [shortInfo, setShortInfo] = useState('');
    const [shortCategory, setShortCategory] = useState('');
    const [shortVideoUrl, setShortVideoUrl] = useState('');
    const [shortThumbnailUrl, setShortThumbnailUrl] = useState(null);
    const [shortThumbnailFile, setShortThumbnailFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleBlur = (f) => setTouched(p => ({ ...p, [f]: true }));

    const inputClass = (f) => `
        w-full px-3 py-2 rounded-lg border text-sm transition-colors
        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        ${errors[f] && touched[f]
            ? 'border-rose-300 bg-rose-50 dark:bg-rose-900/10'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }
        text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
    `;

    const resetForm = () => {
        setIsDrawerOpen(false); setIsEditing(false); setEditingShortId(null);
        setShortName(''); setShortInfo(''); setShortCategory('');
        setShortVideoUrl(''); setShortThumbnailUrl(null); setShortThumbnailFile(null);
        setErrors({}); setTouched({});
    };

    const openAddDrawer = () => { resetForm(); setIsDrawerOpen(true); };

    const handleEditShort = (short) => {
        setIsEditing(true); setEditingShortId(short.id);
        setShortName(short.video_title); setShortInfo(short.video_description);
        setShortCategory(short.domain_id); setShortVideoUrl(short.video_file ?? '');
        setShortThumbnailUrl(short.video_thumbnail ?? null); setShortThumbnailFile(null);
        setErrors({}); setTouched({});
        setIsDrawerOpen(true);
    };

    const handleDeleteShort = async (id, title) => {
        if (!id) return;
        if (window.confirm(`Delete "${title}"?`)) await deleteShortVideo(id);
    };

    const validate = () => {
        const e = {};
        if (!shortName.trim()) e.shortName = "Title is required";
        if (!shortInfo.trim()) e.shortInfo = "Description is required";
        else if (shortInfo.trim().length < 10) e.shortInfo = "Min 10 characters";
        if (!shortCategory) e.shortCategory = "Domain is required";
        if (!shortVideoUrl.trim()) e.shortVideoUrl = "Video URL is required";
        if (!shortThumbnailFile && !shortThumbnailUrl) e.shortThumbnail = "Thumbnail is required";
        setErrors(e);
        setTouched({ shortName: true, shortInfo: true, shortCategory: true, shortVideoUrl: true, shortThumbnail: true });
        return !Object.keys(e).length;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        const fd = new FormData();
        fd.append("video_title", shortName);
        fd.append("video_description", shortInfo);
        fd.append("domain_id", shortCategory);
        fd.append("video_file", shortVideoUrl);
        if (shortThumbnailFile && typeof shortThumbnailFile === "object") fd.append("video_thumbnail", shortThumbnailFile);
        try {
            if (isEditing) await updateShortVideoDetails(editingShortId, fd);
            else await addVideo(fd);
            resetForm();
        } catch {
            setErrors(p => ({ ...p, submit: "Something went wrong. Try again." }));
        }
    };

    const filteredVideos = activeDomainId === 'all' ? videos : videos.filter(v => v.domain_id === activeDomainId);
    const trendingCount = videos.filter(v => v.is_trending).length;
    const activeDomainName = activeDomainId === 'all' ? 'All' : domains.find(d => d.domain_id === activeDomainId)?.domain_name ?? 'All';

    const formatViews = (arr) => {
        const total = arr.reduce((s, v) => {
            const raw = (v.views || '0').toString();
            return s + parseFloat(raw.replace('K', '')) * (raw.includes('K') ? 1000 : 1);
        }, 0);
        if (total >= 1e6) return `${(total / 1e6).toFixed(1)}M`;
        if (total >= 1e3) return `${(total / 1e3).toFixed(1)}K`;
        return String(total || 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daily Shorts </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {videos.length} short{videos.length !== 1 ? 's' : ''} · Manage your short video collection
                            </p>
                        </div>
                    </div>
                    <CustomButton onClick={openAddDrawer} variant="primary" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Short
                    </CustomButton>
                </div>

                {/* Action Message */}
                {actionMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${actionMessage.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        }`}>
                        {actionMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium ${actionMessage.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                }`}>
                                {actionMessage.text}
                            </p>
                            {actionMessage.details && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{actionMessage.details}</p>
                            )}
                        </div>
                        <button onClick={clearMessage} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
                    </div>
                )}


                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard label="Total Shorts" value={videos.length} icon={Clapperboard} color="indigo" />
                    <StatCard label="Total Views" value={formatViews(videos)} icon={Eye} color="blue" />
                    <StatCard label="Trending" value={trendingCount} icon={Flame} color="orange" />
                </div>

                {/* Domain Filters */}
                <div className="mb-6">
                    {/* Mobile filter */}
                    <button
                        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                        className="sm:hidden w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm mb-3"
                    >
                        <span>Domain: <span className="font-medium text-indigo-600 dark:text-indigo-400">{activeDomainName}</span></span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`${mobileFilterOpen ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2`}>
                        {[{ domain_id: 'all', domain_name: 'All' }, ...domains].map((d) => {
                            const active = activeDomainId === d.domain_id;
                            const count = d.domain_id === 'all' ? videos.length : videos.filter(v => v.domain_id === d.domain_id).length;
                            return (
                                <button
                                    key={d.domain_id}
                                    onClick={() => { setActiveDomainId(d.domain_id); setMobileFilterOpen(false); }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {d.domain_name}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-4">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800" />
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin" />
                        </div>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading daily short video...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait while we fetch your short video</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to Load daily short video</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            {error.message ?? "An error occurred while loading music"}
                        </p>
                        <CustomButton variant="outline" onClick={() => window.location.reload()}>Retry</CustomButton>
                    </div>
                )}

                {/* Video Grid */}
                {!loading && !error && filteredVideos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredVideos.map((short) => (
                            <DailyShortCard
                                key={short.id}
                                short={short}
                                isPlaying={currentPlaying === short.id}
                                onPlayPause={(id) => setCurrentPlaying(prev => prev === id ? null : id)}
                                onEdit={handleEditShort}
                                onDelete={handleDeleteShort}
                                isSubmitting={isSubmitting}
                                domains={domains}
                            />
                        ))}
                    </div>
                )}

                
                {/* Empty State */}
                {!loading && !error && filteredVideos.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
                        <Music className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Short Video Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first short video</p>
                        <CustomButton onClick={openAddDrawer} variant="primary" className='mx-auto'>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Short
                        </CustomButton>
                    </div>
                )}

                {/* Pagination */}
                {!loading && (shortVideosDetails?.total_pages ?? 0) > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {Array.from({ length: shortVideosDetails.total_pages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPageNo(p)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pageNo === p
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Drawer */}
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={resetForm}
                title={isEditing ? "Edit Short" : "Upload New Short"}
            >
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shortName}
                                onChange={e => { setShortName(e.target.value); if (errors.shortName) setErrors(p => ({ ...p, shortName: null })); }}
                                onBlur={() => handleBlur('shortName')}
                                placeholder="Enter short title"
                                className={inputClass('shortName')}
                            />
                            {errors.shortName && touched.shortName && (
                                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.shortName}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={shortInfo}
                                rows={3}
                                onChange={e => { setShortInfo(e.target.value); if (errors.shortInfo) setErrors(p => ({ ...p, shortInfo: null })); }}
                                onBlur={() => handleBlur('shortInfo')}
                                placeholder="Describe your short video"
                                className={inputClass('shortInfo')}
                            />
                            {errors.shortInfo && touched.shortInfo && (
                                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.shortInfo}
                                </p>
                            )}
                        </div>

                        {/* Domain */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Domain <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={shortCategory}
                                onChange={e => { setShortCategory(Number(e.target.value)); if (errors.shortCategory) setErrors(p => ({ ...p, shortCategory: null })); }}
                                onBlur={() => handleBlur('shortCategory')}
                                className={inputClass('shortCategory')}
                            >
                                <option value="">Select a domain</option>
                                {domains.map(d => (
                                    <option key={d.domain_id} value={d.domain_id}>{d.domain_name}</option>
                                ))}
                            </select>
                            {errors.shortCategory && touched.shortCategory && (
                                <p className="mt-1 text-xs text-rose-500">{errors.shortCategory}</p>
                            )}
                        </div>

                        {/* YouTube URL */}
                        <div>
                            <YouTubeUrlInput
                                label="YouTube Video URL"
                                name="shortVideoUrl"
                                value={shortVideoUrl}
                                onChange={e => { setShortVideoUrl(e.target.value); if (errors.shortVideoUrl) setErrors(p => ({ ...p, shortVideoUrl: null })); }}
                                onBlur={() => handleBlur('shortVideoUrl')}
                                required
                            />
                            {errors.shortVideoUrl && touched.shortVideoUrl && (
                                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.shortVideoUrl}
                                </p>
                            )}
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Thumbnail <span className="text-rose-500">*</span>
                            </label>
                            <FileUploaderWithPreview
                                key={isEditing ? editingShortId : 'new'}
                                imageFile={shortThumbnailFile}
                                imageUrl={shortThumbnailUrl}
                                setImageFile={file => { setShortThumbnailFile(file); if (errors.shortThumbnail) setErrors(p => ({ ...p, shortThumbnail: null })); }}
                                name="shortThumbnail"
                                label="Upload thumbnail (9:16 recommended)"
                            />
                            {errors.shortThumbnail && touched.shortThumbnail && (
                                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />{errors.shortThumbnail}
                                </p>
                            )}
                        </div>

                        {/* Submit error */}
                        {errors.submit && (
                            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800">
                                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />{errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Form buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {isEditing ? 'Updating...' : 'Uploading...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        {isEditing ? 'Update Short' : 'Upload Short'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </CustomDrawer>
        </div>
    );
};

export default ShortsList;