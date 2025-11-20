import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog} from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import PersonTable from '../components/Person/PersonTable.jsx';
import PersonForm from '../components/Person/PersonForm.jsx';
import PersonService from '../services/Person.jsx';

const PersonPage = () => {
    const toast = useRef(null);
    const [people, setPeople] = useState([]);
    const [selectPerson, setSelectPerson] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const [lazyState, setLazyState] = useState({
        first: 0, rows: 10, sortField: null, sortOrder: null, filters: {}
    });
    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail });
    };
    const loadPeople = async () => {
        try {
            const response = await PersonService.getPeople(lazyState);
            setPeople(response.data.content);
            setTotalRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            showToast('error', 'Ошибка', 'Не удалось загрузить данные');
            setTotalRecords(0);
        }
    };
    useEffect(() => {
        loadPeople(lazyState);
    }, [lazyState]);

    const onCreateSubmit = async (data) => {
        try {
            await PersonService.createPerson(data);
            setCreateDialogVisible(false);
            loadPeople();
            showToast('success', 'Успех', 'Персонаж успешно создан');
        } catch (error) {
            handleError(error);
        }
    };

    const onEditSubmit = async (data) => {
        try {
            await PersonService.updatePerson(selectPerson.id, data);
            setEditDialogVisible(false);
            loadPeople();
            showToast('success', 'Успех', 'Данные персонажа обновлены');
        } catch (error) {
            handleError(error);
        }
    };

    const onDeleteSubmit = async () => {
        try {
            await PersonService.deletePerson(selectPerson.id);
            setDeleteDialogVisible(false);
            setSelectPerson(null);
            if (people.length === 1 && lazyState.first > 0) {
                setLazyState(prev => ({
                    ...prev,
                    first: prev.first - prev.rows
                }));
            } else {
                loadPeople();
            }
            showToast('success', 'Успех', 'Персонаж удален');
        } catch (error) {
            handleError(error);
        }
    };

    const handleCreate = () => {
        setCreateDialogVisible(true);
    }
    const handleEdit = () => {
        if (selectPerson){
            setEditDialogVisible(true);
        }
    };
    const handleDelete = () => {
        if (selectPerson){
            setDeleteDialogVisible(true);
        }
    }
    const handleSelectionChange = (e) => {
        setSelectPerson(e.value);
    }
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
        }
    }

    return (
        <div className="page">
            <Toast ref={toast}/>
            <ConfirmDialog/>

            <Dialog
                header="Создать новую персону"
                visible={createDialogVisible}
                className = "dialogBox"
                onHide={() => setCreateDialogVisible(false)}
                modal
            >
                <div style={{padding: "1rem 2rem"}}>
                    <PersonForm
                        onSubmit={onCreateSubmit}
                        onCancel={() => setCreateDialogVisible(false)}
                    />
                </div>
            </Dialog>

            <Dialog
                header="Редактировать персону"
                visible={editDialogVisible}
                className="dialogBox"
                onHide={() => setEditDialogVisible(false)}
                modal
            >
                {selectPerson && (
                    <PersonForm
                        person={selectPerson}
                        onSubmit={onEditSubmit}
                        onCancel={() => setEditDialogVisible(false)}
                    />
                )}
            </Dialog>
            <Dialog
                header="Удалить персону"
                visible={deleteDialogVisible}
                className = "dialogBox"
                onHide={() => setDeleteDialogVisible(false)}
                modal>
                {selectPerson && (
                    <div style={{textAlign: "center"}}>
                        <p>Вы уверены, что хотите удалить персону c passportId = <strong>{selectPerson.passportId}</strong>?</p>
                        <div style={{marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem"}}>
                            <Button
                                label="Удалить"
                                severity="danger"
                                onClick={() => {
                                    onDeleteSubmit();
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
            <Card title="Список Людей">
                <div>
                    <Button
                        label="Создать"
                        onClick={handleCreate}
                    />
                    <Button
                        label="Изменить"
                        onClick={handleEdit}
                        disabled={!selectPerson}
                    />
                    <Button
                        label="Удалить"
                        severity="danger"
                        onClick={handleDelete}
                        disabled={!selectPerson}
                    />
                </div>

                <PersonTable
                    people={people}
                    selection={selectPerson}
                    onSelectionChange={handleSelectionChange}
                    lazyState = {lazyState}
                    setLazyState = {setLazyState}
                    totalRecords = {totalRecords}
                />
            </Card>
        </div>
    );
};

export default PersonPage;