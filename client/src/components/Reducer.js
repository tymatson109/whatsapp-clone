export const initialState = {
    user: {
        username: null,
        email: null,
        password: null,
        image: null
    },
    chat: {},
    chatZero: {}
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_CHAT: "SET_CHAT",
    SET_CHATZERO: "SET_CHATZERO"
}

const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actionTypes.SET_CHAT:
            return {
                ...state,
                chat: action.chat
            }
        case actionTypes.SET_CHATZERO:
            return {
                ...state,
                chatZero: action.chatZero
            }
        default: 
            return state;
    }
};

export default reducer;