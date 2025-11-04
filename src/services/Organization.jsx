import axios from "axios";

const organizationApi = axios.create({
    baseURL: `app/api/organization`, // для helios ./is_lab1-1.0-SNAPSHOT/
    headers: {
        'Content-Type': 'application/json'
    }
});

const Organization = {
    getOrganizations(lazyState) {
        const params = new URLSearchParams();
        params.append('page', Math.floor(lazyState.first/lazyState.rows)+1);
        params.append('size', lazyState.rows);
        if (lazyState.sortField) {
            const sortDirection = lazyState.sortOrder === 1 ? 'asc' : 'desc';
            params.append('sort', `${lazyState.sortField},${sortDirection}`);
        }
        if (lazyState.filters) {
            for (const [field, filter] of Object.entries(lazyState.filters)) {
                const value = filter.value;
                if (value !== null && value !== undefined && value !== '') {
                    params.append(field, value);
                }
            }
        }

        return organizationApi.get('/all', { params });
    },
    getOrganization(id) {
        return organizationApi.get(`/${id}`);
    },

    createOrganization(organization) {
        const dataToSend = {
            ...organization,
            address: organization.address || null,
            postalAddress: organization.postalAddress || null
        };
        return organizationApi.post('/', organization)
    },

    updateOrganization(id, organization) {
        const dataToSend = {
            ...organization,
            address: organization.address || null,
            postalAddress: organization.postalAddress || null
        };
        return organizationApi.put(`/${id}`, organization)
    },

    countWorkers(id) {
        return organizationApi.get(`/countWorkers/${id}`);
    },

    getOtherOrganizations(id) {
        return organizationApi.get(`/orgToTransfer/${id}`);
    },

    deleteOrganization(id, newOrgId) {
        const config = newOrgId != null ? { params: { newOrgId } } : undefined;
        return organizationApi.delete(`/${id}`, config);
    }
};

export default Organization;