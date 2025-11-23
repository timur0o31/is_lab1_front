import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext"
import "../../App.css"
const OrganizationForm = ({organization, onSubmit,onCancel}) => {
    const [formData,setFormData] = useState({
        officialAddress: {street: null, zipCode: ''},
        annualTurnover: null,
        employeesCount: null,
        fullName: null,
        rating: null,
        postalAddress: {street: null, zipCode: ''}
    })
    const [errors, setErrors] = useState({})
    const [showOfficialAddress, setShowOfficialAddress] = useState(false);
    const [showPostalAddress, setShowPostalAddress] = useState(false);
    const normalizeFormData = (data) => ({
        ...data,
        annualTurnover: data.annualTurnover === "" ? null : data.annualTurnover,
        employeesCount: data.employeesCount === "" ? null : data.employeesCount,
        rating: data.rating === "" ? null : data.rating,
    });
    useEffect (() => {
        if (organization) {
            setFormData({
                officialAddress: {
                    street: organization.officialAddress?.street || null,
                    zipCode: organization.officialAddress?.zipCode || ''
                },
                postalAddress: {
                    street: organization.postalAddress?.street || null,
                    zipCode: organization.postalAddress?.zipCode ?? ''
                },
                annualTurnover: organization.annualTurnover || null,
                employeesCount: organization.employeesCount || null,
                fullName: organization.fullName || null,
                rating: organization.rating || 0
            });
        }
    }, [organization]);
    const handleSubmitForm = (e) => {
        e.preventDefault()
        onSubmit(normalizeFormData(formData));
    }
    const handleFieldChange = (field, val) => {
        if (field === 'employeesCount') {
            if (val === '' || /^\d+$/.test(val)) {
                setFormData(prev => ({ ...prev, [field]: val }));
            }
        }else if (field === 'annualTurnover' || field === 'rating') {
            if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                setFormData(prev => ({...prev, [field]: val}));
            }
        } else {
            setFormData(prev => ({...prev, [field]: val}));
        }
    }
    const handleFirstInputChange = (char, currentValue) => {
        if (/[0-9]/.test(char)) return true;
        if (char === "-") return currentValue.length === 0;
        if (char === ".") {
            if (currentValue.length === 0) return false;
            if (currentValue === "-") return false;
            return !currentValue.includes(".");
        }
        return false;
    }
    const handleOfficialAddressChange = (field, val) => {
        setFormData(prev => ({
            ...prev,
            officialAddress: {...prev.officialAddress, [field]: val}
        }))
    }
    const handlePostalAddressChange = (field, val) => {
        setFormData(prev => ({
            ...prev,
            postalAddress: {...prev.postalAddress, [field]: val}
        }))
    }
    return (
        <form onSubmit={handleSubmitForm}>
            <div>
                <label> Годовой оборот: </label>
                <InputText
                    placeholder="Введите число"
                    value={formData.annualTurnover}
                    onBeforeInput={(e) => {
                        if (!handleFirstInputChange(e.data,e.target.value)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => handleFieldChange("annualTurnover", e.target.value)}
                />
            </div>
            <div>
                <label> Количество работников: </label>
                <InputText
                    placeholder="Введите целое число"
                    value={formData.employeesCount}
                    onChange={(e) => handleFieldChange("employeesCount", e.target.value)}
                    onBeforeInput={(e) => {
                        if (!/[0-9]/.test(e.data)) {
                            e.preventDefault();
                        }
                    }}
                />
            </div>
            <div>
                <label> Полное название: </label>
                <InputText
                       value={formData.fullName}
                       onChange={(e) => handleFieldChange("fullName", e.target.value)}
                />
            </div>
            <div>
                <label> Рейтинг: </label>
                <InputText
                    placeholder="Введите число"
                    onBeforeInput={(e) => {
                        if (!handleFirstInputChange(e.data,e.target.value)) {
                            e.preventDefault();
                        }
                    }}
                    value={formData.rating}
                    onChange={(e) => handleFieldChange("rating", e.target.value)}
                />
            </div>
            <div className="section-container">
                <div className="section-block">
                    <div className="section-header">
                        <h3>Официальный адрес</h3>
                        <button
                            type="button"
                            onClick={() => setShowOfficialAddress((prev) => !prev)}
                            className="toggle-link"
                        >
                            {showOfficialAddress ? "Скрыть" : "Показать"}
                        </button>
                    </div>
                    {showOfficialAddress && (
                        <div className="section-fields">
                            <label> Улица </label>
                            <input
                                type="text"
                                value={formData.officialAddress.street}
                                onChange={(e) => handleOfficialAddressChange("street", e.target.value)}

                            />
                            <label> Почтовый индекс </label>
                            <input
                                type="text"
                                value={formData.officialAddress.zipCode}
                                onChange={(e) => handleOfficialAddressChange("zipCode", e.target.value)}

                            />
                        </div>
                    )}
                </div>
                <div className="section-block">
                        <div className="section-header">
                            <h3> Почтовый адрес</h3>
                            <button
                                type="button"
                                onClick={() => setShowPostalAddress((prev) => !prev)}
                                className='toggle-link'
                            >
                                {showPostalAddress ? "Скрыть" : "Показать"}
                            </button>
                        </div>
                            {showPostalAddress && (
                                <div className='section-fields'>
                                    <label> Улица </label>
                                    <input
                                        type="text"
                                        value={formData.postalAddress.street}
                                        onChange={(e) => handlePostalAddressChange("street", e.target.value)}
                                    />
                                        <label> Почтовый индекс </label>
                                        <input
                                            type="text"
                                            value={formData.postalAddress.zipCode}
                                            onChange={(e) => handlePostalAddressChange("zipCode", e.target.value)}

                                        />
                            </div>)}
                        </div>
                    </div>

                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={onCancel}>Отмена</button>
        </form>

)
}
export default OrganizationForm