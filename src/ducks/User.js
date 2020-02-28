let initialState = {
    user: { user: false }
};

// --- Action Types --- //
const ADD_TO_USER = "ADD_TO_USER";
const DESTROY_USER = "DESTROY_USER";
// --- Reducer Function --- //

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TO_USER:
            return { ...state, ...action.payload };
        case DESTROY_USER:
            return { ...initialState };
        default:
            return { ...state };
    }
}

// --- Action Creators --- //
export function addToUser(data) {
    return {
        type: ADD_TO_USER,
        payload: data
    };
}

export function destroyUser(data = {}) {
    return {
        type: DESTROY_USER,
        payload: initialState
    };
}
