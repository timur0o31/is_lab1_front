import {useEffect, useState} from "react";
import {POSITION} from "../../enums/enums.js";
import {Dropdown} from "primereact/dropdown";
import Person from "../../services/Person.jsx";
import Organization from "../../services/Organization.jsx";
const WorkerForm = ({worker, onSubmit,onCancel}) => {
    const [formData,setFormData] = useState({
        name: '',
        coordinates: {x: 0, y: 0},
        organizationId: null,
        salary: 0.0,
        rating: 0,
        startDate: '',
        endDate: null,
        position: null,
        personId: null
    })

    const [showCoordinates, setShowCoordinates] = useState(false);
    const [persons, setPersons] = useState([])
    const [organizations, setOrganizations] = useState([])
    useEffect (() => {
        if (worker){
            setFormData({
                name: worker.name || '',
                coordinates: worker.coordinates || {x:0, y:0},
                organizationId: worker.organizationId || null,
                salary: worker.salary || 0.0,
                rating: worker.rating || 0,
                position: worker.position || null,
                personId: worker.personId || null,
                startDate: worker.startDate || '',
                endDate: worker.endDate || null
            })
            if (worker.personId) loadPersonInfo(worker.personId);
            if (worker.organizationId) loadOrgInfo(worker.organizationId);
        }
    }, [worker])
    const handleSubmitForm = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }
    const loadPersonInfo = async (id) => {
        try {
            const response = await Person.getPerson(id);
            setPersons([response.data]);
        } catch (e) {
            console.error("Ошибка при загрузке информации о человеке:", e);
        }
    };
    const loadOrgInfo = async (id) => {
        try {
            const response = await Organization.getOrganization(id);
            setOrganizations([response.data]);
        } catch (e) {
            console.error("Ошибка при загрузке информации о человеке:", e);
        }
    };
    const handleFieldChange = (field, val) => setFormData(prev =>({...prev,[field]:val}))
    const handleCoordinatesChange = (field, val) => {
        setFormData(prev => ({
            ...prev,
            coordinates: {...prev.coordinates, [field]: val}
        }))
    }

    const [personTotal, setPersonTotal] = useState(0);
    const [organizationTotal,setOrganizationTotal] = useState(0);
    const handleLazyLoadPersons = async (e = { first: 0, rows: 10 }) => {
        try {
            const lazyState = {
                first: e.first ?? 0,
                rows: e.rows ?? 10,
                sortField: null,
                sortOrder: null,
                filters: {}
            };

            const response = await Person.getPeople(lazyState);

            setPersons(response.data.content);
            setPersonTotal(response.data.totalRecords);
        } catch (err) {
            console.error("Ошибка при загрузке персон:", err);
        }
    };
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
        }catch (err) {
            console.error("Ошибка при загрузке персон:", err);
        }
    };


    return (
        <form onSubmit={handleSubmitForm}>
            <div>
                <label> Имя </label>
                <input type="text"
                       value={formData.name}
                       onChange={(e) => handleFieldChange("name", e.target.value)}
                />
            </div>
            <div>
                <label> зарплата </label>
                <input type="number"
                       value={formData.salary}
                       onChange={(e) => handleFieldChange("salary", e.target.value)}
                />
            </div>
            <div>
                <label> Рейтинг </label>
                <input type="number"
                       value={formData.rating}
                       onChange={(e) => handleFieldChange("rating", e.target.value)}
                />
            </div>
            <div>
                <label> Профессия </label>
                <select
                    value={formData.position}
                    onChange={(e) => handleFieldChange("position", e.target.value)}
                >
                    <option value="">Выберите...</option>
                    {POSITION.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Дата начала работы *</label>
                <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Дата окончания работы</label>
                <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                />
            </div>
            <div>
                <Dropdown
                    value={formData.personId}
                    options={persons}
                    onChange={(e) => handleFieldChange('personId', e.value)}
                    optionLabel="passportId"
                    optionValue="id"
                    placeholder="Выберите человека"
                    className="dropDownBox"
                    panelClassName="dropDownPanel"
                    itemTemplate={(option) => (
                        <div
                            className="dropDownRows"
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "#e0f2fe")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "#ffffff")
                            }
                        >
                            <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                                ID: {option.id} &nbsp;•&nbsp; Паспорт:{" "}
                                {option.passportId || "не указан"}
                            </div>
                        </div>
                    )}
                    virtualScrollerOptions={{
                        itemSize: 38,
                        onLazyLoad: handleLazyLoadPersons,
                        lazy: true,
                        options: {
                            totalRecords: personTotal
                        }
                    }}
                />
            </div>
            <div>
                 <Dropdown
                    value={formData.organizationId}
                    options={organizations}
                    onChange={(e) => handleFieldChange('organizationId', e.value)}
                    optionLabel="fullName"
                    optionValue="id"
                    placeholder="Выберите организацию"
                    className="dropDownBox"
                    panelClassName="dropDownPanel"
                    itemTemplate={(option) => (
                        <div
                            className="dropDownRows"
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "#e0f2fe")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "#ffffff")
                            }
                        >
                            <div className="dropRowStyle">
                                ID: {option.id} &nbsp;•&nbsp; Название организации:{" "}
                                {option.fullName || "не указан"}
                            </div>
                        </div>
                    )}
                    virtualScrollerOptions={{
                        itemSize: 38,
                        onLazyLoad: handleLazyLoadOrganizations,
                        lazy: true,
                        options: {
                            totalRecords: organizationTotal,
                        },
                    }}
                />

            </div>
            <div className="section-container">
            <div className="section-block">
                <div className="section-header">
                    <h3>Добавить новые координаты</h3>
                    <button
                        type="button"
                        onClick={() => setShowCoordinates((prev) => !prev)}
                        className="toggle-link"
                    >
                        {showCoordinates ? "Скрыть координаты" : "Показать координаты"}
                    </button>
                </div>
                    {showCoordinates && (
                            <div className='section-fields'>
                                <div>
                                    <label>x :</label>
                                    <input
                                        type="number"
                                        value={formData.coordinates.x}
                                        onChange={(e) => handleCoordinatesChange("x", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>y :</label>
                                    <input
                                        type="number"
                                        value={formData.coordinates.y}
                                        onChange={(e) => handleCoordinatesChange("y", e.target.value)}
                                    />
                                </div>
                        </div>)}
                </div>
            </div>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>Отмена</button>
        </form>

    )
}
export default WorkerForm