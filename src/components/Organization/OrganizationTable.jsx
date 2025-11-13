import React, {useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const OrganizationTable = ({
                               organizations,
                               selection,
                               onSelectionChange,
                               lazyState,
                               setLazyState,
                               totalRecords
                           }) => {
    const socket = useRef()
    useEffect(() => {
        socket.current = new WebSocket('ws://127.0.0.1:8080/is_lab1-1.0-SNAPSHOT/webSocket')
        socket.current.onopen = () => {
            console.log('connected')
        }
        socket.current.onmessage = (event) => {
            const message  = JSON.parse(event.data)
            if (message.type === 'organization'){
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
            page: event.page,
        }));
    };

    const onSort = (event) => {
        setLazyState(prev => ({
            ...prev,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    };

    const onFilter = (event) => {
        event["first"] = 0;
        setLazyState(prev => ({
            ...prev,
            filters: event.filters,
            first: 0,
            page: 0,
        }));
    };
    return (
        <div className="table-wrapper">
            <DataTable
                value={organizations}
                lazy
                dataKey="id"
                removableSort
                paginator
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                rows={lazyState.rows}
                rowsPerPageOptions={[5, 10, 20]}
                filterDisplay="row"
                emptyMessage="Организации не найдены"
                selectionMode="single"
                selection={selection}
                onSelectionChange={onSelectionChange}
                rowClassName={(rowData) =>
                    rowData.id === selection?.id ? "selected-row" : ""
                }
                first={lazyState.first}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                onFilter={onFilter}
                paginatorClassName="dt-paginator"
                className="custom-table"
            >
                <Column field="id" header="Id"/>
                <Column
                    field="fullName"
                    header="Полное название"
                    sortable
                    filter
                    filterMatchMode="contains"
                    showFilterMenu={false}
                    showClearButton={false}
                />
                <Column
                    field="annualTurnover"
                    header="Годовой оборот"
                    sortable
                    filter
                    filterMatchMode="contains"
                    showFilterMenu={false}
                />
                <Column
                    field="employeesCount"
                    header="Количество работников"
                    sortable
                    filter
                    filterMatchMode="equals"
                    dataType="numeric"
                    showFilterMenu={false}
                />
                <Column
                    field="rating"
                    header="Рейтинг"
                    sortable
                    filter
                    filterMatchMode="contains"
                    dataType="numeric"
                    showFilterMenu={false}
                />
                <Column field="officialAddress.street" header="Улица (офиц.)" sortable/>
                <Column field="officialAddress.zipCode" header="Индекс (офиц.)" sortable/>
                <Column field="postalAddress.street" header="Улица (почтов.)" sortable/>
                <Column field="postalAddress.zipCode" header="Индекс (почтов.)" sortable/>
            </DataTable>
        </div>
    );
};

export default OrganizationTable;
