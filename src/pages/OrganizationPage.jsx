import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown'

import OrganizationTable from '../components/Organization/OrganizationTable.jsx';
import OrganizationForm from '../components/Organization/OrganizationForm.jsx';
import OrganizationService from "../services/Organization.jsx";

const OrganizationListPage = () => {
    const toast = useRef(null);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const [showTransferDialog, setShowTransferDialog] = useState(false);
    const [availableOrgs, setAvailableOrgs] = useState([]);
    const [transferOrgId, setTransferOrgId] = useState(null);
    const [workerCount, setWorkerCount] = useState(0);

    const [lazyState, setLazyState] = useState({
        first: 0, rows: 10, sortField: null, sortOrder: null, filters: {}
    });

    useEffect(() => {
        loadOrganizations();
    }, [lazyState]);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail });
    };

    const loadOrganizations = async () => {
        try {
            const response = await OrganizationService.getOrganizations(lazyState);
            setOrganizations(response.data.content);
            setTotalRecords(response.data.totalRecords);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось загрузить организации'
            });
            setTotalRecords(0);
        }
    };
    const loadOtherOrganizations = async (excludeId) => {
        try {
            const response = await OrganizationService.getOtherOrganizations(excludeId);
            setAvailableOrgs(response.data);
        } catch (error) {
            toast.current.show({severity: 'error', summary: 'Ошибка',
                detail: 'Не удалось загрузить список организаций для перевода'
            });
        }
    };

    const handleCreate = () => setCreateDialogVisible(true);

    const handleEdit = () => {
        if (selectedOrganization) setEditDialogVisible(true);
    };
    const handleDelete = () => {
        if (selectedOrganization) handleDeleteClick(selectedOrganization);
    };
    const handleSelectionChange = (e) => setSelectedOrganization(e.value)
    ;
    const handleDeleteClick = async (org) => {
        setSelectedOrganization(org);
        try {
            const response = await OrganizationService.countWorkers(org.id);
            const count = response.data.count;
            setWorkerCount(count);
            if (count > 0) {
                setShowTransferDialog(true);
                loadOtherOrganizations(org.id);
            } else {
                setDeleteDialogVisible(true);
            }
        } catch (error) {
            showToast('error', 'Ошибка', 'Не удалось проверить количество сотрудников');
        }
    };

    const onCreateSubmit = async (data) => {
        try {
            await OrganizationService.createOrganization(data);
            setCreateDialogVisible(false);
            loadOrganizations();
            showToast('success','Успех','Организация успешно создана')
        } catch (error) {
            handleError(error);
        }
    };

    const onEditSuccess = async (data) => {
        try {
            await OrganizationService.updateOrganization(selectedOrganization.id, data);
            setEditDialogVisible(false);
            loadOrganizations();
            showToast(
                'success',
                'Успех',
                   'Организация обновлена'
            );
        } catch (error) {
            handleError(error);
        }
    };
    const deleteOrganization = async () => {
        try {
            await OrganizationService.deleteOrganization(selectedOrganization.id);
            setDeleteDialogVisible(false);
            setSelectedOrganization(null);
            if (organizations.length === 1 && lazyState.first > 0) {
                setLazyState(prev => ({
                    ...prev,
                    first: prev.first - prev.rows
                }));
            } else {
                loadOrganizations();
            }

            showToast('success', 'Успех', 'Организация удалена');
        } catch (error) {
            handleError(error);
        }
    };
    const deleteWithTransfer = async () => {
        if (!transferOrgId) {
            showToast('warn', 'Нужно выбрать организацию', 'Выберите организацию для перевода сотрудников');
            return;
        }
        try {
            await OrganizationService.deleteOrganization(selectedOrganization.id, transferOrgId);
            setShowTransferDialog(false);
            setSelectedOrganization(null);
            setTransferOrgId(null);
            loadOrganizations();
            showToast('success', 'Успех', 'Организация удалена, сотрудники переведены');
        } catch (error) {
            handleError(error);
        }
    };
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
        }else{
            showToast('error',data.error,data.data);
        }
    }

    return (
        <div className="page">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Dialog
                header="Создать организацию."
                visible={createDialogVisible}
                className = "dialogBox"
                onHide={() => setCreateDialogVisible(false)}
                modal
            >
                <OrganizationForm
                    onSubmit={onCreateSubmit}
                    onCancel={() => setCreateDialogVisible(false)}
                />
            </Dialog>

            <Dialog
                header="Изменить организацию"
                visible={editDialogVisible}
                className = "dialogBox"
                onHide={() => setEditDialogVisible(false)}
                modal
            >
                <OrganizationForm
                    organization={selectedOrganization}
                    onSubmit={onEditSuccess}
                    onCancel={() => setEditDialogVisible(false)}
                />
            </Dialog>
            <Dialog
                header="Удалить организацию"
                visible={deleteDialogVisible}
                className = "dialogBox"
                onHide={() => setDeleteDialogVisible(false)}
                modal>
                {selectedOrganization && (
                    <div style={{textAlign: "center"}}>
                        <p>Вы уверены, что хотите удалить <strong>{selectedOrganization.fullName}</strong>?</p>
                        <div style={{marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem"}}>
                            <Button
                                label="Отмена"
                                outlined
                                onClick={() => setDeleteDialogVisible(false)}
                            />
                            <Button
                                label="Удалить"
                                severity="danger"
                                onClick={deleteOrganization}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
            <Dialog
                header="Удалить организацию"
                visible={showTransferDialog}
                style={{ width: '70vw', maxWidth: '900px', padding: '1rem', backgroundColor: '#f9fafb', border: '2px solid #3b82f6', borderRadius: '12px' }}
                onHide={() => { setShowTransferDialog(false); setTransferOrgId(null); }}
                modal
            >
                {selectedOrganization && (
                    <div>
                        <p>
                            У организации <strong>{selectedOrganization.fullName}</strong> есть сотрудники
                            {typeof workerCount === 'number' && workerCount > 0 ? ` (${workerCount})` : ''}.<br/>
                            Выберите организацию, в которую их перевести перед удалением:
                        </p>

                        {availableOrgs.length === 0 ? (
                            <p style={{ marginTop: '1rem' }}>
                                Нет доступных организаций для перевода. Сначала создайте другую организацию и переведите туда рабочих, или сначала увольте всех сотрудников из организации, а затем удалите её.
                            </p>
                        ) : (
                            <Dropdown
                                value={transferOrgId}
                                options={availableOrgs}
                                onChange={(e) => setTransferOrgId(e.value)}
                                optionLabel="fullName"
                                optionValue="id"
                                placeholder="Выберите новую организацию"
                                className="dropDownBox"
                                panelClassName="dropDownPanel"
                            />
                        )}

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <Button label="Отмена" outlined onClick={() => { setShowTransferDialog(false); setTransferOrgId(null); }} />
                            <Button
                                label="Удалить и перевести"
                                severity="danger"
                                onClick={deleteWithTransfer}
                                disabled={!transferOrgId || availableOrgs.length === 0}
                            />
                        </div>
                    </div>
                )}
            </Dialog>


            <Card title="Список организаций">
                <div className="mb-3 flex gap-2">
                    <Button
                        label="Создать"
                        onClick={handleCreate} />
                    <Button
                        label="Изменить"
                        onClick={handleEdit}
                        disabled={!selectedOrganization}
                    />
                    <Button
                        label="Удалить"
                        onClick={handleDelete}
                        disabled={!selectedOrganization}
                    />
                </div>

                <OrganizationTable
                    organizations={organizations}
                    selection={selectedOrganization}
                    onSelectionChange={handleSelectionChange}
                    lazyState = {lazyState}
                    setLazyState = {setLazyState}
                    totalRecords = {totalRecords}
                />
            </Card>
        </div>
    );
};
export default OrganizationListPage;
