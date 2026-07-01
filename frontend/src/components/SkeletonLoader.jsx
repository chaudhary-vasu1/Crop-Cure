import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        if (type === 'chart') {
            return (
                <div className="w-full bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 p-6 rounded-3xl animate-pulse space-y-4">
                    <div className="h-4 w-1/3 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
                    <div className="h-60 bg-slate-100 dark:bg-gray-950 rounded-2xl relative overflow-hidden flex items-end justify-between p-4">
                        <div className="h-12 w-8 bg-slate-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-24 w-8 bg-slate-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-40 w-8 bg-slate-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-32 w-8 bg-slate-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-48 w-8 bg-slate-200 dark:bg-gray-800 rounded"></div>
                    </div>
                </div>
            );
        }

        if (type === 'table') {
            return (
                <div className="w-full bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl animate-pulse overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 flex gap-4">
                        <div className="h-3 w-16 bg-slate-205 dark:bg-gray-800 rounded"></div>
                        <div className="h-3 w-24 bg-slate-205 dark:bg-gray-800 rounded"></div>
                        <div className="h-3 w-32 bg-slate-205 dark:bg-gray-800 rounded"></div>
                    </div>
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="h-3.5 w-12 bg-slate-200 dark:bg-gray-800 rounded"></div>
                                <div className="h-3.5 w-28 bg-slate-200 dark:bg-gray-800 rounded"></div>
                                <div className="h-3.5 w-40 bg-slate-200 dark:bg-gray-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Default card skeleton
        return (
            <div className="p-6 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-gray-800 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-gray-800 rounded"></div>
                        <div className="h-3 w-1/3 bg-slate-200 dark:bg-gray-800 rounded"></div>
                    </div>
                </div>
                <div className="h-16 bg-slate-100 dark:bg-gray-950 rounded-xl"></div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-6 w-full">
            {[...Array(count)].map((_, i) => (
                <React.Fragment key={i}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </div>
    );
};

export default SkeletonLoader;
