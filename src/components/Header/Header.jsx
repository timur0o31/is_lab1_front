import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import './Header.css';
const Header = () => {
    const links = [
        {label: 'Работники', path:'/'},
        {label: 'Люди', path:'/people'},
        {label: 'Организации', path:'/organizations'},
        {label: 'Специальные операции', path:'/special_operations'}]
    const menuTemplate = (item) => (
        <Link to={item.path} className='custom-link'>
            {item.label}
        </Link>
    )
    const items = links.map((data) => ({...data, template:  menuTemplate}));
    return(
        <div className='header-wrapper'>
            <Menubar
            model = {items}
            start={<h2>Lab1</h2>}
        />
        </div>
    )
}
export default Header