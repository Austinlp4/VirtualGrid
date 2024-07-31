import React, { useState } from 'react';
import { cloneElement } from 'react';
import { GridHeader } from './grid-header';
import { GridContent } from './grid-content-v2';
import { GridRow } from './grid-row';
import { GridContainer } from './grid-container';
import { Pagination } from './pagination';

import './grid.css';

const Grid = ({
    children,
    columnMapping,
    methodMapping,
    customComponents,
    setData,
    data,
    selectable,
    itemsPerPage = 10
}) => {
    let [selectedRows, setSelectedRows] = useState([]);
    let [currentPage, setCurrentPage] = useState(1);

    const handleSelect = (row) => {
        if (selectedRows === 'all') {
            setSelectedRows([row]);
            return;
        }
        if (row === 'all' && selectedRows !== 'all') {
            setSelectedRows('all');
            return;
        }
        if (row === 'all' && selectedRows === 'all') {
            setSelectedRows([]);
            return;
        }
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
            return;
        }
        setSelectedRows([...selectedRows, row]);
    };

    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            if (child.type === Pagination) {
                return cloneElement(child, {
                    key: index,
                    totalItems: data.length,
                    itemsPerPage,
                    currentPage,
                    setCurrentPage
                });
            }

            const childProps = child.props;
            const newProps = { 
                key: index,
                ...childProps, 
                // DATA PROPS
                columnMapping,
                customComponents,
                data: data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
                selectable,
                selectedRows,
                // METHODS PROPS
                setData,
                handleSelect
            };

            if (childProps.excludeProps) {
                childProps.excludeProps.forEach(prop => {
                    delete newProps[prop];
                });
            }

            return cloneElement(child, newProps);
        });
    };

    return (
        <div className="grid-container">
            <GridContainer>
                {renderChildren()}
            </GridContainer>    
        </div>
    );
};

Grid.Header = GridHeader;
Grid.Content = GridContent;
Grid.Pagination = Pagination;

export default Grid;
