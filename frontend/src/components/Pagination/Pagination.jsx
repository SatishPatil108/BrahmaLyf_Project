import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    currentPageSize = null, // Optional: current page size
    onPageSizeChange = null, // Optional: function to change page size
    pageSizeOptions = [10, 20, 50, 100], // Options for page size
    showPageNumbers = true,
    showInfo = true,
    showPageSize = false, // Control visibility of page size selector
    size = "medium"
}) => {
    const { theme } = useTheme();
    const [showSizeOptions, setShowSizeOptions] = useState(false);
    
    // Only show page size controls if both currentPageSize and onPageSizeChange are provided
    const shouldShowPageSize = showPageSize && currentPageSize !== null && onPageSizeChange !== null;

    if (totalPages <= 1) return null;

    // Size styles
    const sizeStyles = {
        small: {
            button: "px-3 py-1.5 text-sm",
            icon: "w-4 h-4",
            text: "text-sm",
            dropdown: "text-xs"
        },
        medium: {
            button: "px-4 py-2.5 text-base",
            icon: "w-5 h-5",
            text: "text-base",
            dropdown: "text-sm"
        },
        large: {
            button: "px-5 py-3 text-lg",
            icon: "w-6 h-6",
            text: "text-lg",
            dropdown: "text-base"
        }
    };

    const styles = sizeStyles[size] || sizeStyles.medium;

    // Theme-based colors
    const themeColors = {
        dark: {
            bg: "bg-gray-800/50",
            border: "border-gray-700",
            hoverBg: "hover:bg-gray-700/50",
            text: "text-gray-300",
            mutedText: "text-gray-400",
            hoverText: "hover:text-white",
            disabled: "text-gray-600 bg-gray-800/30",
            activeBg: "bg-gradient-to-r from-purple-600 to-pink-600",
            inputBg: "bg-gray-900 border-gray-700 text-white",
            focusRing: "focus:ring-purple-500 focus:ring-offset-gray-900",
            dropdownBg: "bg-gray-800 border-gray-700",
            dropdownItem: "hover:bg-gray-700"
        },
        light: {
            bg: "bg-white/50",
            border: "border-gray-200",
            hoverBg: "hover:bg-gray-100/70",
            text: "text-gray-700",
            mutedText: "text-gray-500",
            hoverText: "hover:text-gray-900",
            disabled: "text-gray-400 bg-gray-100",
            activeBg: "bg-gradient-to-r from-purple-500 to-pink-500",
            inputBg: "bg-white border-gray-300 text-gray-900",
            focusRing: "focus:ring-purple-500 focus:ring-offset-white",
            dropdownBg: "bg-white border-gray-200",
            dropdownItem: "hover:bg-gray-100"
        }
    };

    const colors = themeColors[theme] || themeColors.light;

    // Calculate page range
    const getPageRange = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i, index) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const pageRange = getPageRange();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            {/* Page Info */}
            {showInfo && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className={`${styles.text} font-medium ${colors.text}`}>
                        Page <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{currentPage}</span>
                        {" "}of{" "}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{totalPages}</span>
                        {" "}•{" "}
                        <span className={colors.mutedText}>{totalPages} total pages</span>
                    </div>
                    
                    {/* Page Size Info - only show if shouldShowPageSize is true */}
                    {shouldShowPageSize && (
                        <div className={`${styles.text} font-medium ${colors.mutedText} flex items-center gap-1`}>
                            • Showing {currentPageSize} per page
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Page Size Selector - Only shows if shouldShowPageSize is true */}
                {shouldShowPageSize && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowSizeOptions(!showSizeOptions)}
                            className={`
                                ${styles.button} rounded-xl flex items-center justify-center gap-2 font-medium
                                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
                                backdrop-blur-sm border ${colors.border}
                                ${colors.bg} ${colors.hoverBg} ${colors.text} ${colors.hoverText} 
                                hover:scale-105 hover:shadow-lg
                                ${colors.focusRing}
                            `}
                            aria-label="Change page size"
                        >
                            <span>{currentPageSize} per page</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showSizeOptions ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Options */}
                        {showSizeOptions && (
                            <>
                                {/* Backdrop */}
                                <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowSizeOptions(false)}
                                />
                                
                                {/* Dropdown Menu */}
                                <div className={`
                                    absolute bottom-full left-0 mb-2 z-50 py-1 rounded-xl border
                                    ${styles.dropdown} ${colors.dropdownBg} ${colors.border}
                                    shadow-xl backdrop-blur-sm
                                `}>
                                    {pageSizeOptions.map((sizeOption) => (
                                        <button
                                            key={sizeOption}
                                            type="button"
                                            onClick={() => {
                                                onPageSizeChange(sizeOption);
                                                setShowSizeOptions(false);
                                                // Reset to first page when changing page size
                                                onPageChange(1);
                                            }}
                                            className={`
                                                w-full px-4 py-2.5 text-left transition-colors
                                                ${colors.text} ${colors.dropdownItem}
                                                ${currentPageSize === sizeOption 
                                                    ? `${colors.activeBg} text-white font-medium` 
                                                    : ''
                                                }
                                            `}
                                        >
                                            {sizeOption} per page
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`
                            ${styles.button} rounded-xl flex items-center justify-center gap-2 font-medium
                            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
                            backdrop-blur-sm border ${colors.border}
                            ${currentPage === 1
                                ? `cursor-not-allowed ${colors.disabled}`
                                : `${colors.bg} ${colors.hoverBg} ${colors.text} ${colors.hoverText} hover:scale-105 hover:shadow-lg`
                            }
                            ${colors.focusRing}
                        `}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className={styles.icon} />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {showPageNumbers && (
                        <div className="flex items-center gap-1 mx-2">
                            {pageRange.map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span
                                            key={`dots-${index}`}
                                            className={`px-3 py-2 ${colors.mutedText}`}
                                        >
                                            <MoreHorizontal className={styles.icon} />
                                        </span>
                                    );
                                }

                                const isCurrent = page === currentPage;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`
                                            ${styles.button} rounded-xl font-medium transition-all duration-300
                                            focus:outline-none focus:ring-2 focus:ring-offset-2
                                            backdrop-blur-sm border ${colors.border}
                                            ${isCurrent
                                                ? `${colors.activeBg} text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30`
                                                : `${colors.bg} ${colors.hoverBg} ${colors.text} ${colors.hoverText} hover:scale-105 hover:shadow-lg`
                                            }
                                            ${colors.focusRing}
                                        `}
                                        aria-label={`Page ${page}`}
                                        aria-current={isCurrent ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`
                            ${styles.button} rounded-xl flex items-center justify-center gap-2 font-medium
                            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
                            backdrop-blur-sm border ${colors.border}
                            ${currentPage === totalPages
                                ? `cursor-not-allowed ${colors.disabled}`
                                : `${colors.bg} ${colors.hoverBg} ${colors.text} ${colors.hoverText} hover:scale-105 hover:shadow-lg`
                            }
                            ${colors.focusRing}
                        `}
                        aria-label="Next page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className={styles.icon} />
                    </button>
                </div>
            </div>

            {/* Page Input (Optional) */}
            {totalPages > 10 && (
                <div className="flex items-center gap-2">
                    <span className={`${styles.text} ${colors.mutedText}`}>Go to:</span>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            defaultValue={currentPage}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    const page = parseInt(e.target.value);
                                    if (page >= 1 && page <= totalPages) {
                                        onPageChange(page);
                                        e.target.value = '';
                                    }
                                }
                            }}
                            className={`
                                ${styles.button} w-20 rounded-xl border backdrop-blur-sm
                                ${colors.inputBg}
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                [&::-webkit-inner-spin-button]:appearance-none
                                ${colors.focusRing}
                            `}
                            placeholder="Page"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pagination;