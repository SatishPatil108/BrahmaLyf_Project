import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Sparkles, Filter, X, CloudCog } from 'lucide-react';
import useCategories from './useCategories';
import SubCategories from '../getAllSubCategories/SubCategories';
import { useTheme } from "@/contexts/ThemeContext";

const Categories = () => {
    const { theme } = useTheme();
    const { loading, error, domainsDetails, selectedCategory, setSelectedCategory } = useCategories();
    const [activeTab, setActiveTab] = useState(0);
    const scrollRef = useRef(null);

    const domains = domainsDetails?.domains || [];

    useEffect(() => {
        if (domains.length !== 0 && !selectedCategory) {
            setSelectedCategory(domains[0].domain_name);
            setActiveTab(0);
        }
    }, [domains, selectedCategory, setSelectedCategory]);

    const scrollToCategory = (index) => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const tabElement = container.children[index];
            if (tabElement) {
                const scrollLeft = tabElement.offsetLeft - container.offsetLeft - 20;
                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handleCategoryClick = (categoryName, index) => {
        setSelectedCategory(categoryName);
        setActiveTab(index);

    };

    // Category color variations
    const getCategoryColor = (index) => {
        const colors = [
            'bg-gradient-to-r from-purple-500 to-pink-500',
            'bg-gradient-to-r from-blue-500 to-cyan-400',
            'bg-gradient-to-r from-emerald-500 to-teal-400',
            'bg-gradient-to-r from-orange-500 to-amber-400',
            'bg-gradient-to-r from-violet-500 to-purple-400',
            'bg-gradient-to-r from-rose-500 to-pink-400',
            'bg-gradient-to-r from-indigo-500 to-blue-400',
            'bg-gradient-to-r from-green-500 to-emerald-400'
        ];
        return colors[index % colors.length];
    };

    // Error state
    if (error) {
        return (
            <div className={`py-12 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`p-6 rounded-xl text-center ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex flex-col items-center gap-3">
                        <X className={`w-8 h-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                        <p className={`font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                            {error.message || 'Failed to load categories'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Reorder domains: selected category first, then others
    const orderedDomains = selectedCategory
        ? [
            ...domains.filter(d => d.domain_name === selectedCategory),
            ...domains.filter(d => d.domain_name !== selectedCategory)
        ]
        : domains;

    return (
        <div className={`py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-transparent ${theme === 'dark' ? 'text-gray-100'
            : 'text-gray-900'}`}>

            {/* Header - Responsive */}
            <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4 justify-center">
                    <div className={`p-2 rounded-lg ${theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                        <Filter className="w-5 h-5 text-white" />
                    </div>

                    <h2 className="text-3xl mb-4 sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                        Categories
                    </h2>
                </div>
                <p className={`text-base sm:text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Browse through our curated collection of programs
                </p>
            </div>

            {/* Category Tabs - Responsive */}
            <div className="relative mb-8 sm:mb-12 px-2 pt-4">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-3 pb-4 px-1"
                >
                    {domains.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category.domain_name, index)}
                            className={`shrink-0 transition-all duration-300 ease-out ${index === activeTab ? 'scale-105' : 'hover:scale-102'}`}
                        >
                            <div
                                className={`px-4  sm:px-6 py-2 sm:py-3 rounded-full border-2 transition-all duration-300 flex items-center gap-2 ${category.domain_name === selectedCategory
                                    ? `${getCategoryColor(index)} text-white border-transparent shadow-lg`
                                    : theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 border-gray-700 hover:border-purple-500 hover:text-purple-300'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700'
                                    }`}
                            >
                                {category.domain_name === selectedCategory && (
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                                )}
                                <span className="font-medium whitespace-nowrap text-sm sm:text-base">
                                    {category.domain_name}
                                </span>
                                {category.domain_name === selectedCategory && (
                                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Category Info */}
            {selectedCategory && (
                <div className="mb-6 sm:mb-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                        <div>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {selectedCategory}
                            </h3>
                            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Discover programs and resources in this category
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* SubCategories - Reordered with selected category first */}
            <div className="space-y-8 sm:space-y-10">
                {orderedDomains.map((category, index) => (
                    <div
                        key={index}
                        id={category.domain_name}
                        className={`relative`}
                    >
                        <SubCategories category={category} isFirst={category.domain_name === selectedCategory} />
                    </div>
                ))}
            </div>
            {/* Empty State */}
            {domains.length === 0 && !loading && (
                <div className={`py-12 sm:py-16 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <Filter className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        No Categories Available
                    </h3>
                    <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Categories will be added soon
                    </p>
                </div>
            )}
        </div>
    );
};

export default Categories;