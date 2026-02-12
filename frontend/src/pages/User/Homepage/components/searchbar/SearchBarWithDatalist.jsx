import { Search, Loader2, X, Video, BookOpen, ChevronRight, Sparkles, SearchCheck } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import useHomepage from "../../useHomepage";
import { searchAPI } from "@/store/feature/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const SearchBarWithDatalist = () => {
    const dispatch = useDispatch();
    const { isSpin, searchDetails, error } = useHomepage();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all"); // all, courses, videos
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme(); // Get theme from context

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ========== THEME CONFIGURATION ==========
    const themeConfig = {
        light: {
            colors: {
                // Backgrounds
                background: '#f8fafc',
                surface: '#ffffff',
                elevated: '#f1f5f9',
                overlay: 'rgba(0, 0, 0, 0.02)',
                
                // Text
                text: {
                    primary: '#1e293b',
                    secondary: '#475569',
                    tertiary: '#64748b',
                    placeholder: '#94a3b8',
                },
                
                // Primary (Indigo)
                primary: {
                    DEFAULT: '#4f46e5',
                    light: '#818cf8',
                    dark: '#4338ca',
                    bg: 'rgba(99, 102, 241, 0.05)',
                },
                
                // Secondary (Purple)
                secondary: {
                    DEFAULT: '#7c3aed',
                    bg: 'rgba(124, 58, 237, 0.05)',
                },
                
                // Accents
                accent: {
                    course: '#0284c7',
                    video: '#059669',
                },
                
                // Borders
                border: {
                    light: '#e2e8f0',
                    medium: '#cbd5e1',
                    strong: '#94a3b8',
                },
                
                // Feedback
                feedback: {
                    error: '#dc2626',
                    success: '#16a34a',
                }
            },
            
            shadows: {
                card: '0 20px 60px rgba(99, 102, 241, 0.1), 0 4px 24px rgba(99, 102, 241, 0.06)',
                input: '0 0 0 3px rgba(99, 102, 241, 0.15)',
                dropdown: '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
            },
            
            borderRadius: {
                sm: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.25rem',
            },
            
            typography: {
                mobile: {
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                },
                desktop: {
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                }
            }
        },
        dark: {
            colors: {
                // Backgrounds
                background: '#0f172a',
                surface: '#1e293b',
                elevated: '#334155',
                overlay: 'rgba(255, 255, 255, 0.05)',
                
                // Text
                text: {
                    primary: '#f1f5f9',
                    secondary: '#cbd5e1',
                    tertiary: '#94a3b8',
                    placeholder: '#64748b',
                },
                
                // Primary (Indigo)
                primary: {
                    DEFAULT: '#818cf8',
                    light: '#a5b4fc',
                    dark: '#6366f1',
                    bg: 'rgba(99, 102, 241, 0.1)',
                },
                
                // Secondary (Purple)
                secondary: {
                    DEFAULT: '#a78bfa',
                    bg: 'rgba(167, 139, 250, 0.1)',
                },
                
                // Accents
                accent: {
                    course: '#0ea5e9',
                    video: '#10b981',
                },
                
                // Borders
                border: {
                    light: '#334155',
                    medium: '#475569',
                    strong: '#64748b',
                },
                
                // Feedback
                feedback: {
                    error: '#f87171',
                    success: '#34d399',
                }
            },
            
            shadows: {
                card: '0 10px 40px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4)',
                input: '0 0 0 3px rgba(99, 102, 241, 0.3)',
                dropdown: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            },
            
            borderRadius: {
                sm: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.25rem',
            },
            
            typography: {
                mobile: {
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                },
                desktop: {
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                }
            }
        }
    };

    const currentTheme = themeConfig[theme] || themeConfig.light;

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved).slice(0, 5));
        }
    }, []);

    // Save search to recent
    const saveToRecentSearches = (term) => {
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((term) => {
            if (term.trim().length >= 2) {
                dispatch(searchAPI(term));
                setIsDropdownVisible(true);
            }
        }, 300),
        [dispatch]
    );

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setIsDropdownVisible(false);
            return;
        }
        
        saveToRecentSearches(searchTerm);
        dispatch(searchAPI(searchTerm));
        setIsDropdownVisible(true);
        
        // Focus input on mobile after search
        if (isMobile) {
            inputRef.current?.blur();
        }
    };

    const handleSelectItem = (item, type) => {
        setSearchTerm(item.name || item.title || item.course_name);
        saveToRecentSearches(item.name || item.title || item.course_name);
        
        if (type === 'course') {
            navigate(`/enrolled-course/${item.course_id || item.id}`);
        } else if (type === 'video') {
            navigate(`/video/${item.video_id || item.id}`);
        }
        
        setIsDropdownVisible(false);
        setIsFocused(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim().length >= 2) {
            debouncedSearch(value);
            setIsDropdownVisible(true);
        } else {
            setIsDropdownVisible(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setIsDropdownVisible(false);
        inputRef.current?.focus();
    };

    // Filter results based on active category
    const filteredCourses = activeCategory === 'all' || activeCategory === 'courses' 
        ? searchDetails?.courses || []
        : [];
    
    const filteredVideos = activeCategory === 'all' || activeCategory === 'videos'
        ? searchDetails?.videos || []
        : [];

    const hasResults = filteredCourses.length > 0 || filteredVideos.length > 0;
    const showRecentSearches = !searchTerm && isFocused && recentSearches.length > 0;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsDropdownVisible(false);
                setIsFocused(false);
                inputRef.current?.blur();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div 
            ref={dropdownRef}
            className={`relative w-full max-w-xl mx-auto px-4 sm:px-0 transition-colors duration-300`}
            style={{ color: currentTheme.colors.text.primary }}
        >
            {/* Search Bar Container */}
            <div className="relative">
                {/* Search Input */}
                <div 
                    className={`flex items-center transition-all duration-300 ${
                        isFocused ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                        backgroundColor: currentTheme.colors.surface,
                        border: `1px solid ${isFocused ? currentTheme.colors.primary.DEFAULT : currentTheme.colors.border.medium}`,
                        borderRadius: currentTheme.borderRadius.lg,
                        boxShadow: isFocused ? currentTheme.shadows.input : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Search Icon */}
                    <div className="pl-4 pr-2">
                        <Search 
                            size={isMobile ? 18 : 20}
                            className="transition-colors duration-200"
                            style={{ 
                                color: isFocused 
                                    ? currentTheme.colors.primary.DEFAULT 
                                    : currentTheme.colors.text.tertiary 
                            }}
                        />
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setIsFocused(true);
                            if (searchTerm.length >= 2 || recentSearches.length > 0) {
                                setIsDropdownVisible(true);
                            }
                        }}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Search courses, videos, or topics..."
                        className="flex-1 bg-transparent outline-none py-3 sm:py-4 pr-12 w-full placeholder:transition-colors placeholder:text-sm sm:placeholder:text-base"
                        style={{
                            fontSize: isMobile ? currentTheme.typography.mobile.base : currentTheme.typography.desktop.base,
                            color: currentTheme.colors.text.primary,
                            '--tw-placeholder-opacity': '1',
                        }}
                        autoComplete="off"
                        aria-label="Search courses and videos"
                    />

                    {/* Clear & Loading Indicators */}
                    <div className="absolute right-3 flex items-center gap-2">
                        {searchTerm && !isSpin && (
                            <button
                                onClick={clearSearch}
                                className="p-1 rounded-full hover:opacity-80 transition-opacity duration-200"
                                style={{ backgroundColor: currentTheme.colors.overlay }}
                                aria-label="Clear search"
                            >
                                <X size={isMobile ? 14 : 16} style={{ color: currentTheme.colors.text.tertiary }} />
                            </button>
                        )}
                        
                        {isSpin ? (
                            <Loader2 
                                size={isMobile ? 18 : 20}
                                className="animate-spin"
                                style={{ color: currentTheme.colors.primary.DEFAULT }}
                            />
                        ) : (
                            <button
                                onClick={handleSearch}
                                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                style={{ 
                                    backgroundColor: searchTerm 
                                        ? currentTheme.colors.primary.DEFAULT 
                                        : 'transparent',
                                    color: searchTerm ? '#ffffff' : currentTheme.colors.text.tertiary,
                                }}
                                aria-label="Search"
                                disabled={!searchTerm.trim()}
                            >
                                <Search size={isMobile ? 16 : 18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Tips */}
                {!searchTerm && !isFocused && (
                    <div className="hidden sm:flex items-center gap-3 mt-3 px-2 animate-fadeIn">
                        <span className="text-xs opacity-70" style={{ color: currentTheme.colors.text.secondary }}>
                            Try: 
                        </span>
                        {['Meditation', 'Yoga', 'Breathing', 'Mindfulness'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setSearchTerm(tag);
                                    dispatch(searchAPI(tag));
                                    setIsDropdownVisible(true);
                                }}
                                className="text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{
                                    backgroundColor: currentTheme.colors.overlay,
                                    color: currentTheme.colors.text.secondary,
                                    border: `1px solid ${currentTheme.colors.border.light}`,
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isDropdownVisible && (
                <div 
                    className="absolute w-full mt-2 z-50 animate-fadeIn"
                    style={{
                        backgroundColor: currentTheme.colors.surface,
                        borderRadius: currentTheme.borderRadius.lg,
                        boxShadow: currentTheme.shadows.dropdown,
                        border: `1px solid ${currentTheme.colors.border.light}`,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Category Tabs */}
                    {hasResults && (
                        <div className="flex items-center gap-1 p-2 border-b"
                             style={{ borderColor: currentTheme.colors.border.light }}
                        >
                            {[
                                { id: 'all', label: 'All', icon: SearchCheck },
                                { id: 'courses', label: 'Courses', icon: BookOpen },
                                { id: 'videos', label: 'Videos', icon: Video },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveCategory(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        activeCategory === tab.id ? 'scale-105' : ''
                                    }`}
                                    style={{
                                        backgroundColor: activeCategory === tab.id 
                                            ? currentTheme.colors.primary.bg 
                                            : 'transparent',
                                        color: activeCategory === tab.id
                                            ? currentTheme.colors.primary.DEFAULT
                                            : currentTheme.colors.text.secondary,
                                    }}
                                >
                                    <tab.icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Recent Searches */}
                        {showRecentSearches && (
                            <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border.light }}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold flex items-center gap-2"
                                        style={{ color: currentTheme.colors.text.primary }}
                                    >
                                        <Sparkles size={16} />
                                        Recent Searches
                                    </h3>
                                    {recentSearches.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setRecentSearches([]);
                                                localStorage.removeItem('recentSearches');
                                            }}
                                            className="text-xs hover:opacity-70 transition-opacity duration-200"
                                            style={{ color: currentTheme.colors.text.tertiary }}
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {recentSearches.map((term, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSearchTerm(term);
                                                dispatch(searchAPI(term));
                                            }}
                                            className="flex items-center justify-between w-full p-2 rounded-lg hover:opacity-90 transition-all duration-200 group hover:scale-[1.01]"
                                            style={{ 
                                                backgroundColor: currentTheme.colors.overlay,
                                                color: currentTheme.colors.text.secondary,
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Search size={14} />
                                                <span className="text-sm truncate">{term}</span>
                                            </div>
                                            <ChevronRight 
                                                size={16} 
                                                className="opacity-0 group-hover:opacity-70 transition-opacity"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        {searchTerm && (
                            <div className="p-4">
                                {/* Results Count */}
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold mb-1"
                                        style={{ color: currentTheme.colors.text.primary }}
                                    >
                                        Results for "{searchTerm}"
                                    </h3>
                                    <p className="text-xs" style={{ color: currentTheme.colors.text.tertiary }}>
                                        {filteredCourses.length + filteredVideos.length} results found
                                    </p>
                                </div>

                                {/* No Results */}
                                {!hasResults && (
                                    <div className="text-center py-8 animate-fadeIn">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                             style={{ backgroundColor: currentTheme.colors.overlay }}
                                        >
                                            <Search size={24} style={{ color: currentTheme.colors.text.tertiary }} />
                                        </div>
                                        <p className="font-medium mb-2" style={{ color: currentTheme.colors.text.primary }}>
                                            No results found
                                        </p>
                                        <p className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                                            Try different keywords or check your spelling
                                        </p>
                                    </div>
                                )}

                                {/* Courses Results */}
                                {filteredCourses.length > 0 && (
                                    <div className="mb-6 animate-slideUp">
                                        <div className="flex items-center gap-2 mb-3">
                                            <BookOpen size={18} style={{ color: currentTheme.colors.accent.course }} />
                                            <h4 className="text-sm font-semibold"
                                                style={{ color: currentTheme.colors.text.primary }}
                                            >
                                                Courses ({filteredCourses.length})
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {filteredCourses.slice(0, isMobile ? 3 : 5).map((course, index) => (
                                                <button
                                                    key={course.id}
                                                    onClick={() => handleSelectItem(course, 'course')}
                                                    className="flex items-center gap-3 w-full p-3 rounded-xl text-left group hover:scale-[1.02] transition-all duration-200 animate-fadeIn"
                                                    style={{ 
                                                        backgroundColor: currentTheme.colors.elevated,
                                                        border: `1px solid ${currentTheme.colors.border.light}`,
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                         style={{ backgroundColor: currentTheme.colors.primary.bg }}
                                                    >
                                                        <BookOpen size={18} style={{ color: currentTheme.colors.primary.DEFAULT }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate mb-1"
                                                           style={{ color: currentTheme.colors.text.primary }}
                                                        >
                                                            {course.course_name}
                                                        </p>
                                                        <p className="text-xs truncate"
                                                           style={{ color: currentTheme.colors.text.tertiary }}
                                                        >
                                                            {course.instructor || 'BrahmaLYF'}
                                                        </p>
                                                    </div>
                                                    <ChevronRight 
                                                        size={16} 
                                                        className="opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0"
                                                        style={{ color: currentTheme.colors.text.secondary }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos Results */}
                                {filteredVideos.length > 0 && (
                                    <div className="animate-slideUp delay-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Video size={18} style={{ color: currentTheme.colors.accent.video }} />
                                            <h4 className="text-sm font-semibold"
                                                style={{ color: currentTheme.colors.text.primary }}
                                            >
                                                Videos ({filteredVideos.length})
                                            </h4>
                                        </div>
                                        <div className="space-y-2">
                                            {filteredVideos.slice(0, isMobile ? 3 : 5).map((video, index) => (
                                                <button
                                                    key={video.id}
                                                    onClick={() => handleSelectItem(video, 'video')}
                                                    className="flex items-center gap-3 w-full p-3 rounded-xl text-left group hover:scale-[1.02] transition-all duration-200 animate-fadeIn"
                                                    style={{ 
                                                        backgroundColor: currentTheme.colors.elevated,
                                                        border: `1px solid ${currentTheme.colors.border.light}`,
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                         style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                                                    >
                                                        <Video size={18} style={{ color: currentTheme.colors.accent.video }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate mb-1"
                                                           style={{ color: currentTheme.colors.text.primary }}
                                                        >
                                                            {video.title}
                                                        </p>
                                                        <p className="text-xs truncate"
                                                           style={{ color: currentTheme.colors.text.tertiary }}
                                                        >
                                                            {video.duration || 'Video'} • {video.category || 'General'}
                                                        </p>
                                                    </div>
                                                    <ChevronRight 
                                                        size={16} 
                                                        className="opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0"
                                                        style={{ color: currentTheme.colors.text.secondary }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* View All Results */}
                    {hasResults && searchTerm && (
                        <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border.light }}>
                            <button
                                onClick={handleSearch}
                                className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 animate-fadeIn"
                                style={{ 
                                    backgroundColor: currentTheme.colors.primary.bg,
                                    color: currentTheme.colors.primary.DEFAULT,
                                }}
                            >
                                View all {filteredCourses.length + filteredVideos.length} results
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBarWithDatalist;