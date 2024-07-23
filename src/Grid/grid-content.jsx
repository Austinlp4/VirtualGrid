import PropTypes from 'prop-types';
import { 
    useState,
    useEffect,
    useRef
} from 'react';

export const GridContent = ({ 
    data, 
    columnMapping,
    customComponents,
    renderedRange = 10,
    selectable,
    selectedRows,
    handleSelect
}) => {
    let [rowData, setRowData] = useState([]);

    const hasScrolledPastCheckpoint = useRef(false);
    const heightFromTop = useRef(0);
    const currentLastIndex = useRef(renderedRange);
    const lastDirection = useRef('down');

    const Row = customComponents && customComponents['grid-row']['component'] || GridRow;
    const rowProps = customComponents && customComponents['grid-row']['props'] || {};
    const MergedRowComponent = (props) => (
        <Row 
            {...rowProps}
            {...props}
            columnMapping={columnMapping} 
            customCell={customComponents && customComponents['grid-cell'] || null}
            selectable={selectable}
            selectedRows={selectedRows}
            handleSelect={handleSelect}
        />
    );

    useEffect(() => {
        const initialRows = data.slice(0, renderedRange);
        setRowData(initialRows);
    }, [data]);

    useEffect(() => {
        if (!rowData.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const isStart = target === document.querySelector('.grid-row:nth-child(2)');
                    const isEnd = target === document.querySelector('.grid-row:nth-last-child(2)');

                    if (isStart && !!hasScrolledPastCheckpoint.current) {
                        let newFirstIndex = currentLastIndex.current - renderedRange;

                        if(lastDirection.current === 'down') {
                            newFirstIndex = currentLastIndex.current - (renderedRange * 2);
                        }

                        if(newFirstIndex < 0) {
                            return;
                        }

                        const newRowSet = data.slice(newFirstIndex, currentLastIndex.current);

                        setRowData((prevRows) => {
                            const persistedRows = prevRows;
                            if(persistedRows.length > renderedRange) {
                                persistedRows.splice(0, renderedRange);
                                currentLastIndex.current = currentLastIndex - renderedRange;
                            }
                            return newRowSet.concat(persistedRows);
                        });
                    } else if (isEnd) {
                        const newLastIndex = currentLastIndex.current + renderedRange;

                        if(newLastIndex > data.length) {
                            return;
                        }

                        const newRowSet = data.slice(currentLastIndex.current, newLastIndex);
                        setRowData((prevRows) => {
                            const persistedRows = prevRows;

                            if(persistedRows.length > renderedRange) {
                                persistedRows.splice(renderedRange, persistedRows.length - 1);
                            }

                            return persistedRows.concat(newRowSet)
                        });
                        currentLastIndex.current = newLastIndex;
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });

        const fourthFromStart = document.querySelector('.grid-row:nth-child(2)');
        const fourthToLast = document.querySelector('.grid-row:nth-last-child(2)');

        if (!!fourthFromStart) {
            observer.observe(fourthFromStart);
        }
        if(!!fourthToLast) {
            observer.observe(fourthToLast);
        }

        const firstThreeRows = document.querySelectorAll('.grid-row:nth-child(-n+2)');

        const height = Array.from(firstThreeRows).reduce((acc, row) => {
            return acc + row.clientHeight;
        }, 0);

        heightFromTop.current = height;

        return () => { 
            observer.unobserve(fourthFromStart);
            observer.unobserve(fourthToLast); 
            hasScrolledPastCheckpoint.current = false;
        };
    }, [
        rowData,
    ]);

    const handleScroll = (e) => {
        if (!!hasScrolledPastCheckpoint.current) {
            return;
        }

        if (e.target.scrollTop > heightFromTop.current) {
            console.log('scrolled past checkpoint');
            hasScrolledPastCheckpoint.current = true;
        }
    }

    console.log('rowData: ', rowData);  

    return (
        <div className="grid-content" onScroll={handleScroll}>
            {rowData.map((row, index) => (
                <MergedRowComponent 
                    key={index}
                    row={row}
                />
            ))}
        </div>
    );
}