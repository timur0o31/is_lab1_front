import React, { useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { POSITION } from '../../enums/enums.js';

const WorkerTable = ({
                         workers,
                         selection,
                         onSelectionChange,
                         lazyState,
                         setLazyState,
                         totalRecords,
                         loadWorkers
                     }) => {


    const socket = useRef()
    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:5050')

        socket.current.onopen = () => {
            console.log('connected')
        }
        socket.current.onmessage = (event) => {
            const message  = JSON.parse(event.data)
            if (message.type === 'person'){
                setLazyState(prev => ({...prev}));
            }
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт');
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка');
        }
        return () => {
            if (socket.current){
                socket.current.close();
            }
        }
    }, []);
    const onPage = (event) => {
        setLazyState(prev => ({
            ...prev,
            first: event.first,
            rows: event.rows,
            page: event.page
        }));
    };

    const onSort = (event) => {
        setLazyState(prev => ({
            ...prev,
            sortField: event.sortField,
            sortOrder: event.sortOrder
        }));
    };

    const onFilter = (event) => {
        event['first'] = 0;
        setLazyState(prev => ({
            ...prev,
            filters: event.filters,
            first: 0,
            page: 0
        }));
    };

    const positionFilterElement = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={POSITION}
                panelClassName="dropDownPanel"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Все"
            />
        );
    }

    return (
        <div>
            <DataTable
                value={workers}
                lazy
                dataKey="id"
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                removableSort
                paginator
                rows={lazyState.rows}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filterDisplay="row"
                emptyMessage="Работники не найдены"
                selectionMode="single"
                selection={selection}
                onSelectionChange={onSelectionChange}
                showGridlines
                rowClassName={(rowData) =>
                    rowData.id === selection?.id ? "selected-row" : ""
                }
                first={lazyState.first}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                onFilter={onFilter}
            >
                <Column field="id" header="Id"/>
                <Column
                    field="name"
                    header="Имя"
                    sortable
                    filter
                    filterMatchMode="contains"
                    showFilterMenu={false}
                    showClearButton={false}
                />
                <Column
                    field="position"
                    header="Профессия"
                    sortable
                    filterElement={positionFilterElement}
                    filter
                    filterMatchMode="equals"
                    showFilterMenu={false}
                    showClearButton
                />
                <Column
                    field="salary"
                    header="Зарплата"
                    sortable
                    filter
                    filterMatchMode="gte"
                    dataType="numeric"
                    showFilterMenu={false}
                />
                <Column
                    field="rating"
                    header="Рейтинг"
                    sortable
                    filter
                    filterMatchMode="gte"
                    dataType="numeric"
                    showFilterMenu={false}
                />
                <Column field="creationDate" header="Дата создания" sortable/>
                <Column field="startDate" header="Дата начала работы" sortable/>
                <Column field ="endDate" header="Дата конца работы" sortable/>
                <Column field="coordinates.x" header="X" sortable />
                <Column field="coordinates.y" header="Y" sortable />
                <Column field="organizationId" header="ID Орг."/>
                <Column field="personId" header="ID Чел."/>
            </DataTable>
        </div>
    );
};

export default WorkerTable;