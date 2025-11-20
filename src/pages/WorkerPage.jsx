import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog} from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

import WorkerTable from '../components/worker/WorkerTable.jsx';
import WorkerForm from '../components/worker/WorkerForm.jsx';
import Worker from "../services/Worker.jsx";

const WorkerPage = () => {
    const toast = useRef(null);

    const [workers, setWorkers] = useState([]);
    const [lazyState, setLazyState] = useState({
        first: 0, rows: 10, sortField: null, sortOrder: null, filters: {}
    });
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life:10000});
    };
    const loadWorkers = async () => {
        try {
            const response = await Worker.getWorkers(lazyState);
            setWorkers(response.data.content);
            setTotalRecords(response.data.totalRecords);
            console.log(response.data.content.length+" и "+response.data.totalRecords);
        } catch (error) {
            showToast('error', 'Ошибка', 'Не удалось загрузить работников');
        }
    };
    useEffect(() => {
        loadWorkers();
    }, [lazyState]);

    const onCreateSuccess = async (workerData) => {
        try {
            await Worker.createWorker(workerData);
            setCreateDialogVisible(false);
            loadWorkers();
            showToast('success', 'Успех', 'Работник создан');
        } catch (error) {
            handleError(error);
        }
    };
    const onEditSuccess = async (workerData) => {
        if (!selectedWorker?.id) return;
        try {
            await Worker.updateWorker(selectedWorker.id, workerData);
            setEditDialogVisible(false);
            loadWorkers();
            showToast('success', 'Успех', 'Данные работника обновлены');
        } catch (error) {
            handleError(error);
        }
    };

    const deleteWorker = async (id) => {
        try {
            await Worker.deleteWorker(id);
            loadWorkers();
            setSelectedWorker(null);
            showToast('success', 'Успех', 'Работник удален');
        } catch (error) {
            handleError(error);
        }
    };
    const handleCreate = () => setCreateDialogVisible(true);
    const handleEdit = () => { if (selectedWorker) setEditDialogVisible(true); };
    const handleSelectionChange = (e) => setSelectedWorker(e.value);
    const handleDelete = () => {if (selectedWorker) setDeleteDialogVisible(true)};
    const handleError = (error) => {
        if (!error.response){
            showToast('error','Ошибка', 'Проверь подключение')
        }
        const data = error.response.data;
        if (data?.fields) {
            const errorList = (
                <ul>
                    {Object.entries(data.fields).map(([field, msg], index) => (
                        <li key={index}>
                            <strong>{field}</strong>: {msg}
                        </li>
                    ))}
                </ul>
            );
            showToast('error',data.error, errorList);
            return;
        }
        if (data?.error){
            showToast('error',data.error,data.data);
            return;
        }
    }
    return (
        <div className="page">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Dialog
                header="Создать работника"
                visible={createDialogVisible}
                className = "dialogBox"
                onHide={() => setCreateDialogVisible(false)}
                modal
            >
                <WorkerForm
                    onSubmit={onCreateSuccess}
                    onCancel={() => setCreateDialogVisible(false)}
                />
            </Dialog>

            <Dialog
                header="Редактировать работника"
                visible={editDialogVisible}
                className="dialogBox"
                onHide={() => setEditDialogVisible(false)}
                modal
            >
                {selectedWorker && (
                    <WorkerForm
                        worker={selectedWorker}
                        onSubmit={onEditSuccess}
                        onCancel={() => setEditDialogVisible(false)}
                    />
                )}
            </Dialog>
            <Dialog
                header="Удалить работника"
                visible={deleteDialogVisible}
                className="dialogBox"
                onHide={() => setDeleteDialogVisible(false)}
                modal>
                {selectedWorker && (
                    <div style={{textAlign: "center"}}>
                        <p>Вы уверены, что хотите удалить <strong>{selectedWorker.name}</strong>?</p>
                        <div style={{marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem"}}>
                            <Button
                                label="Удалить"
                                severity="danger"
                                onClick={() => {
                                    deleteWorker(selectedWorker.id);
                                    setDeleteDialogVisible(false);
                                }}
                            />
                            <Button
                                label="Отмена"
                                onClick={() => setDeleteDialogVisible(false)}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <Card title="Список Работников">
                <div>
                    <Button
                        label="Создать"
                        onClick={handleCreate}
                    />
                    <Button
                        label="Изменить"
                        onClick={handleEdit}
                        disabled={!selectedWorker}
                    />
                    <Button
                        label="Удалить"
                        severity="danger"
                        onClick={handleDelete}
                        disabled={!selectedWorker}
                    />
                </div>

                <WorkerTable
                    workers={workers}
                    selection={selectedWorker}
                    onSelectionChange={handleSelectionChange}
                    lazyState={lazyState}
                    setLazyState={setLazyState}
                    totalRecords={totalRecords}
                />
            </Card>
        </div>
    );
};

export default WorkerPage;