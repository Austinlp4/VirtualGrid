import React from 'react';

export const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPages = Math.floor(maxPagesToShow / 2);
        let startPage = Math.max(1, currentPage - halfMaxPages);
        let endPage = Math.min(totalPages, currentPage + halfMaxPages);

        if (currentPage <= halfMaxPages) {
            endPage = Math.min(totalPages, maxPagesToShow);
        } else if (currentPage + halfMaxPages >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <button key={1} onClick={() => handleClick(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="start-ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button 
                    key={i} 
                    onClick={() => handleClick(i)} 
                    className={i === currentPage ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="end-ellipsis">...</span>);
            }
            pageNumbers.push(
                <button key={totalPages} onClick={() => handleClick(totalPages)}>
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="pagination">
            <button 
                onClick={handlePrevious} 
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

