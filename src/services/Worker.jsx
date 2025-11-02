import axios from 'axios';


const workerApi = axios.create({
    baseURL: `app/api/worker`, // для локалки надо опять прописать app
    headers: {
        'Content-Type': 'application/json'
    }
});

const Worker = {

    getWorkers(lazyState) {
        const params = new URLSearchParams();

        params.append('page', Math.floor(lazyState.first / lazyState.rows)+1);
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

        return workerApi.get('/all', { params });
    },

    getWorker(id) {
        return workerApi.get(`/${id}`);
    },

    createWorker(worker) {
        const dataToSend = {
            ...worker,
            coordinates: worker.coordinates || { x: 0, y: 0 },
            startDate: worker.startDate || null,
            endDate: worker.endDate || null
        };
        return workerApi.post('/', dataToSend);
    },

    updateWorker(id, worker) {
        const dataToSend = {
            ...worker,
            coordinates: worker.coordinates || { x: 0, y: 0 },
            startDate: worker.startDate || null,
            endDate: worker.endDate || null
        };
        return workerApi.put(`/${id}`, dataToSend);
    },

    deleteWorker(id) {
        return workerApi.delete(`/${id}`);
    },
    getSumRating() {
        return workerApi.get("/sum-rating");
    },
    findByNamePrefix(prefix) {
        return workerApi.get(`/name-prefix?prefix=${encodeURIComponent(prefix)}`);
    },
    findByEndDateAfter(date) {
        const iso = date instanceof Date ? date.toISOString().split("T")[0] : date;
        return workerApi.get(`/end-date?date=${iso}`);
    },
    hireWorker(workerId, orgId) {
        return workerApi.put(`/hire?workerId=${workerId}&organizationId=${orgId}`);
    },
    getWorkersByOrganization(orgId){
        return workerApi.get(`/by-organization/${orgId}`)
    },
    fireWorker(workerId) {
        return workerApi.put(`/fire/${workerId}`);
    },
    getUnemployedPeople(){
        return workerApi.get(`/unemployed`)
    }

};

export default Worker;
