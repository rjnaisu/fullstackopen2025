export default function notifReducer(state, action) {
  switch (action.type) {
    case "show": {
      return {
        message: action.payload.message,
        status: action.payload.status,
      };
    }
    case "clear": {
      return null;
    }
    default:
      return state;
  }
}
