import React, {useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { COLOR, COUNTRIES } from "../../enums/enums.js";
import '../../App.css'

const PersonTable = ({
                         people,
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
    const colorFilterElement = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={COLOR}
                panelClassName="dropDownPanel"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Все"
            />
        );
    };

    const countriesFilter = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={COUNTRIES}
                panelClassName="dropDownPanel"
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Все"
            />
        );
    };

    return (
        <div className="table-wrapper">
            <DataTable
                value={people}
                dataKey="id"
                lazy
                first={lazyState.first}
                rows={lazyState.rows}
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                totalRecords={totalRecords}
                tableStyle={{ minWidth: "1000px", tableLayout: "fixed" }}
                columnResizeMode="fit"
                paginatorClassName="dt-paginator"
                className="custom-table"
                scrollHeight="flex"
                onPage={onPage}
                onSort={onSort}
                onFilter={onFilter}
                paginator
                rowsPerPageOptions={[5, 10, 20]}
                removableSort
                filterDisplay="row"
                emptyMessage="Люди не найдены"
                selectionMode="single"
                selection={selection}
                onSelectionChange={onSelectionChange}
                rowClassName={(rowData) =>
                    rowData.id === selection?.id ? "selected-row" : ""
                }
            >
                <Column field="id" header="Id"

                        style={{ width: "200px" }}
                        headerStyle={{ width: "100px",textAlign:"center" }}
                />
                <Column
                    field="passportId"
                    header="Passport Id"
                    sortable
                    filter
                    filterPlaceholder = "Поиск по ID"
                    filterMatchMode="contains"
                    showFilterMenu={false}
                />
                <Column
                    field="eyeColor"
                    header="Цвет глаз"
                    sortable
                    filterElement={colorFilterElement}
                    filter
                    showFilterMenu={false}
                    showClearButton
                    filterMatchMode="equals"

                />
                <Column
                    field="hairColor"
                    header="Цвет волос"
                    sortable
                    filterElement={colorFilterElement}
                    filter
                    showFilterMenu={false}
                    showClearButton
                    filterMatchMode="equals"
                />
                <Column
                    field="nationality"
                    header="Национальность"
                    sortable
                    filterElement={countriesFilter}
                    filter
                    showFilterMenu={false}
                    showClearButton
                    filterMatchMode="equals"
                />
                <Column field="location.x" header="X" sortable/>
                <Column field="location.y" header="Y" sortable/>
                <Column field="location.z" header="Z" sortable/>
            </DataTable>
        </div>
    );
};

export default PersonTable;
