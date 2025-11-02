import {useEffect, useState} from "react";
import "../../App.css"
const OrganizationForm = ({organization, onSubmit,onCancel}) => {
    const [formData,setFormData] = useState({
        officialAddress: {street: '', zipCode: ''},
        annualTurnover: 0.0,
        employeesCount: 0,
        fullName: '',
        rating: 0.0,
        postalAddress: {street: '', zipCode: ''}
    })
    const [showOfficialAddress, setShowOfficialAddress] = useState(false);
    const [showPostalAddress, setShowPostalAddress] = useState(false);
    useEffect (() => {
        if (organization) {
            setFormData({
                officialAddress: {
                    street: organization.officialAddress?.street ?? '',
                    zipCode: organization.officialAddress?.zipCode ?? ''
                },
                postalAddress: {
                    street: organization.postalAddress?.street ?? '',
                    zipCode: organization.postalAddress?.zipCode ?? ''
                },
                annualTurnover: organization.annualTurnover ?? 0,
                employeesCount: organization.employeesCount ?? 0,
                fullName: organization.fullName ?? '',
                rating: organization.rating ?? 0
            });
        }
    }, [organization]);
    const handleSubmitForm = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }
    const handleFieldChange = (field, val) => setFormData(prev =>({...prev,[field]:val}))
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
                <input type="number"
                       value={formData.annualTurnover}
                       onChange={(e) => handleFieldChange("annualTurnover", e.target.value)}
                />
            </div>
            <div>
                <label> Количество работников: </label>
                <input type="number"
                       value={formData.employeesCount}
                       onChange={(e) => handleFieldChange("employeesCount", e.target.value)}
                />
            </div>
            <div>
                <label> Полное название: </label>
                <input type="text"
                       value={formData.fullName}
                       onChange={(e) => handleFieldChange("fullName", e.target.value)}
                />
            </div>
            <div>
                <label> Рейтинг: </label>
                <input type="number"
                       value={formData.rating}
                       onChange={(e) => handleFieldChange("rating", e.target.value)}
                />
            </div>
            <div className="section-container">
                <div className="section-block">
                    <div className="section-header">
                        <h3>Официальный сайт</h3>
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