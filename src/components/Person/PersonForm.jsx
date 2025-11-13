import { useEffect, useState } from "react";
import { COLOR, COUNTRIES } from "../../enums/enums.js";

const PersonForm = ({ person, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        eyeColor: null,
        hairColor: null,
        location: null,
        passportId: null,
        nationality: null
    });

    const [showLocation, setShowLocation] = useState(false);

    useEffect(() => {
        if (person) {
            setFormData({
                eyeColor: person.eyeColor || null,
                hairColor: person.hairColor || null,
                location: person.location || null,
                passportId: person.passportId || null,
                nationality: person.nationality || null
            });
            if (person.location) {
                setShowLocation(true);
            }
        }
    }, [person]);

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            location: isLocationFilled() ? formData.location : null
        };

        onSubmit(dataToSubmit);
    };

    const handleFieldChange = (field, val) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const handleLocationChange = (field, val) => {
        if (/^\d*$/.test(val)) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...(prev.location || {x: "", y: "", z: ""}), [field]: val
                }
            }));
        }
    };

    const isLocationFilled = () => {
        if (!formData.location) return false;
        const { x, y, z } = formData.location;
        return x !== "" && x !== null ||
            y !== "" && y !== null ||
            z !== "" && z !== null;
    };

    const toggleLocation = () => {
        if (!showLocation) {
            setFormData(prev => ({
                ...prev,
                location: prev.location || { x: "", y: "", z: "" }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                location: null
            }));
        }
        setShowLocation(prev => !prev);
    };

    return (
        <form onSubmit={handleSubmitForm}>
            <div>
                <label>Цвет глаз</label>
                <select
                    value={formData.eyeColor || ""}
                    onChange={(e) => handleFieldChange("eyeColor", e.target.value || null)}
                >
                    <option value="">Выберите...</option>
                    {COLOR.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Цвет волос</label>
                <select
                    value={formData.hairColor || ""}
                    onChange={(e) => handleFieldChange("hairColor", e.target.value || null)}
                >
                    <option value="">Выберите...</option>
                    {COLOR.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>ID паспорта</label>
                <input
                    type="text"
                    value={formData.passportId || ""}
                    onChange={(e) => handleFieldChange("passportId", e.target.value || null)}
                />
            </div>

            <div>
                <label>Национальность</label>
                <select
                    value={formData.nationality || ""}
                    onChange={(e) => handleFieldChange("nationality", e.target.value || null)}
                >
                    <option value="">Выберите...</option>
                    {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="section-block">
                <div className="section-header">
                    <h3>Добавить локацию (опционально)</h3>
                    <button type="button" onClick={toggleLocation} className="toggle-link">
                        {showLocation ? "Скрыть" : "Показать"}
                    </button>
                </div>

                {showLocation && (
                    <div className="section-fields">
                        <div>
                            <label>X:</label>
                            <input
                                type="text"
                                value={formData.location?.x ?? ""}
                                onChange={(e) => handleLocationChange("x", e.target.value)}
                                placeholder="Введите координату X"
                            />
                        </div>

                        <div>
                            <label>Y:</label>
                            <input
                                type="text"
                                value={formData.location?.y ?? ""}
                                onChange={(e) => handleLocationChange("y", e.target.value)}
                                placeholder="Введите координату Y"
                            />
                        </div>

                        <div>
                            <label>Z:</label>
                            <input
                                type="text"
                                value={formData.location?.z ?? ""}
                                onChange={(e) => handleLocationChange("z", e.target.value)}
                                placeholder="Введите координату Z"
                            />
                        </div>
                    </div>
                )}
            </div>

            <button type="submit">Сохранить</button>
            <button type="button" onClick={onCancel}>
                Отмена
            </button>
        </form>
    );
};

export default PersonForm;