import axios from 'axios';

const personApi = axios.create({
    baseURL: `app/api/person`,
    headers: {
        'Content-Type': 'application/json'
    }
});
const Person = {

    getPeople(lazyState) {
        const params = new URLSearchParams();

        params.append('page', Math.floor(lazyState.first/lazyState.rows)+1);
        params.append('size', lazyState.rows);

        if (lazyState.sortField) {
            params.append('sortColumn', lazyState.sortField);
            params.append('asc', lazyState.sortOrder === 1);
        }else{
            params.append('sortColumn', 'id');
            params.append('asc', true);
        }

        if (lazyState.filters) {
            for (const [field, filter] of Object.entries(lazyState.filters)) {
                const value = filter.value;
                if (value !== null && value !== undefined && value !== '') {
                    params.append(field, value);
                }
            }
        }

        return personApi.get('/all', { params });
    },


    getPerson(id) {
        return personApi.get(`/${id}`);
    },
    createPerson(person) {

        const dataToSend = {
            ...person,
            location: person.location || { x: 0, y: 0, z: 0 },
        };
        return personApi.post('/', dataToSend);
    },

    updatePerson(id, person) {
        const dataToSend = {
            ...person,
            location: person.location || { x: 0, y: 0, z: 0 },
        };
        return personApi.put(`/${id}`, dataToSend);
    },

    deletePerson(id) {
        return personApi.delete(`/${id}`);
    },
};

export default Person;