import React from 'react';
import { Table } from 'antd';
import Loading from '../LoadingComponent/Loading';
import { useState } from 'react';

const TableComponent = (props) => {
    const {
        selectionType = 'checkbox',
        data = [],
        isLoading = false,
        columns = [],
        handleDelteMany,
    } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    //    const newColumnExport = useMemo(() => {
    //        const arr = columns?.filter((col) => col.dataIndex !== 'action');
    //        return arr;
    //    }, [columns]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
    };
    const handleDeleteAll = () => {
        handleDelteMany(rowSelectedKeys);
    };

    return (
        <div>
            <Loading isLoading={isLoading}>
                {rowSelectedKeys.length > 0 && (
                    <div
                        style={{
                            background: 'var(--primary-color)',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '10px',
                        }}
                        onClick={handleDeleteAll}
                    >
                        Xóa tất cả
                    </div>
                )}

                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    {...props}
                />
            </Loading>
        </div>
    );
};

export default TableComponent;
