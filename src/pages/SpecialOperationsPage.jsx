import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";

import WorkerService from "../services/Worker";
import Organization from "../services/Organization.jsx";
import Worker from "../services/Worker";


const SpecialOperationsWorkerPage = () => {
    const toast = useRef(null);

    const [prefix, setPrefix] = useState("");
    const [endDate, setEndDate] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [result, setResult] = useState("");
    const [errors, setErrors] = useState({});
    const [orgId, setOrgId] = useState(0);

    const [organizations, setOrganizations] = useState([]);
    const [organizationTotal, setOrganizationTotal] = useState(0);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
    const [workerIdToFire, setWorkerIdToFire] = useState(null);
    const [workerIdToHire, setWorkerIdToHire] = useState(null);

    const resetState = () => {
        setWorkers([]);
        setResult("");
        setErrors({});
    };
    const [flag,setFlag] = useState(false);
    const handleLazyLoadOrganizations = async (e = { first: 0, rows: 10 }) => {
        try {
            const lazyState = {
                first: e.first ?? 0,
                rows: e.rows ?? 10,
                sortField: null,
                sortOrder: null,
                filters: {}
            };

            const response = await Organization.getOrganizations(lazyState);
            setOrganizations(response.data.content);
            setOrganizationTotal(response.data.totalRecords);
        } catch (err) {
            console.error("Ошибка при загрузке организаций:", err);
        }
    };
    const handleLoadWorkers = async () => {
        resetState();
        setFlag(false);
        try {
            const res = await Worker.getWorkersByOrganization(orgId);
            setWorkers(res.data);
        } catch (error) {
            handleError('Нe удалось загрузить работников');
        }
    };
    const handleLoadUnemployed = async() =>{
        resetState();
        setFlag(false);
        try{
            const res = await Worker.getUnemployedPeople();
            setWorkers(res.data);
        } catch (error) {
            handleError('Нe удалось загрузить безработных');
        }
    }
    const handleError = (msg) => {
        toast.current.show({ severity: "error", summary: "Ошибка", detail: msg });
    };

    const handleSuccess = (msg) => {
        toast.current.show({ severity: "success", summary: "Успех", detail: msg });
    };

    const handleSumRating = async () => {
        resetState();
        try {
            const res = await WorkerService.getSumRating();
            setResult(`Сумма всех rating: ${res.data}`);
            console.log("Сумма всех rating: "+ res.data);
        } catch {
            handleError("Не удалось вычислить сумму рейтингов");
        }
    };

    const handleFindByPrefix = async () => {
        if (!prefix.trim()) {
            setErrors({ prefix: "Введите подстроку" });
            return;
        }
        resetState();
        try {
            const res = await WorkerService.findByNamePrefix(prefix);
            setWorkers(res.data);
            setFlag(true);
        } catch {
            handleError("Не удалось получить работников");
        }
    };

    const handleFindByEndDate = async () => {
        if (!endDate) {
            setErrors({ endDate: "Выберите дату" });
            return;
        }
        resetState();
        try {
            const res = await WorkerService.findByEndDateAfter(endDate);
            setWorkers(res.data);
            setFlag(true);
        } catch {
            handleError("Не удалось получить работников по дате");
        }
    };

    const handleHireWorker = async () => {
        if (!workerIdToHire) {
            setErrors({ hire: "Выберите безработного" });
            return;
        }
        resetState();
        try {
            let id = Number(workerIdToHire)
            await WorkerService.hireWorker(id, selectedOrganizationId);
            handleSuccess(
                `Рабочий #${id} принят в организацию #${selectedOrganizationId}`
            );
        } catch {
            handleError("Не удалось принять сотрудника");
        }
    };

    const handleFireWorker = async () => {
        if (!workerIdToFire) {
            setErrors({ fire: "Введите ID работника" });
            return;
        }
        resetState();
        try {
            let id = Number(workerIdToFire)
            await WorkerService.fireWorker(id);
            handleSuccess(`Работник #${workerIdToFire} уволен`);
        } catch {
            handleError("Не удалось уволить работника");
        }
    };


    return (
        <div>
            <Toast ref={toast} />
            <Card title="Специальные операции с работниками" className="flex-container">

                <div className="mb-4">
                    <Button
                        label="Рассчитать сумму всех рейтингов"
                        onClick={handleSumRating}
                        className="p-button-info mb-3"
                    />
                </div>

                <div className="mb-4">
                    <label>Имя начинается с:</label>
                    <InputText
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        className={classNames({ "p-invalid": errors.prefix })}
                    />
                    <Button label="Найти работников" onClick={handleFindByPrefix} className="mt-2" />
                </div>

                <div className="mb-4">
                    <label>Дата окончания после:</label>
                    <Calendar
                        value={endDate}
                        onChange={(e) => setEndDate(e.value)}
                        dateFormat="yy-mm-dd"
                        className={classNames({ "p-invalid": errors.endDate })}
                    />
                    <Button label="Показать работников" onClick={handleFindByEndDate} className="mt-2" />
                </div>

                <div className="mb-4">
                    <h4>Принять человека в организацию</h4>

                    <Dropdown
                        value={workerIdToHire}
                        options={workers}
                        onChange={(e) => setWorkerIdToHire(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        className="dropDownBox"
                        panelClassName="dropDownPanel"
                        placeholder="Выберите безработного"
                        style={{ width: "100%" }}
                        virtualScrollerOptions={{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: handleLoadUnemployed
                        }}
                    />

                    <Dropdown
                        value={selectedOrganizationId}
                        options={organizations}
                        onChange={(e) => setSelectedOrganizationId(e.value)}
                        optionLabel="fullName"
                        optionValue="id"
                        placeholder="Выберите организацию"
                        className="dropDownBox"
                        panelClassName="dropDownPanel"
                        virtualScrollerOptions={{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: handleLazyLoadOrganizations,
                            options: { totalRecords: organizationTotal }
                        }}
                    />

                    <Button
                        label="Принять сотрудника"
                        onClick={handleHireWorker}
                        className="mt-2 p-button-success"
                    />
                </div>

                <div>
                    <label>Организация </label>
                    <Dropdown
                        value={orgId}
                        options={organizations}
                        onChange={(e) => setOrgId(e.value)}
                        optionLabel="fullName"
                        optionValue="id"
                        placeholder="Выберите организацию"
                        className="dropDownBox"
                        panelClassName="dropDownPanel"
                        virtualScrollerOptions={{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: handleLazyLoadOrganizations
                        }}
                    />
                    <label>ID сотрудника для увольнения:</label>
                    <Dropdown
                        value={workerIdToFire}
                        options={workers}
                        onChange={(e) => setWorkerIdToFire(e.value)}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Выберите активного рабочего"
                        className="dropDownBox"
                        panelClassName="dropDownPanel"
                        virtualScrollerOptions={{
                            itemSize: 38,
                            lazy: true,
                            onLazyLoad: handleLoadWorkers
                        }}
                    />
                    <Button
                        label="Уволить сотрудника"
                        onClick={handleFireWorker}
                        className="mt-2 p-button-danger"
                    />
                </div>

                {result && (
                    <Card title="Результат">
                        <p>{result}</p>
                    </Card>
                )}
            </Card>
            {workers.length > 0 &&  flag && (
                <Card title="Результаты поиска работников" className="flex-container">
                    <DataTable value={workers} paginator rows={5} emptyMessage="Нет данных">
                        <Column field="id" header="ID" />
                        <Column field="name" header="Имя" />
                        <Column field="rating" header="Рейтинг" />
                        <Column field="salary" header="Зарплата" />
                        <Column field="position" header="Позиция" />
                        <Column field="organization.fullName" header="Организация" />
                        <Column field="endDate" header="Дата окончания" />
                    </DataTable>
                </Card>
            )}
        </div>
    );
};

export default SpecialOperationsWorkerPage;
