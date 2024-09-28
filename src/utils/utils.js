
// Utility function to format time in the format "MMM DD, HH:mm"
export const formatTime = (date = new Date()) => {
    return date.toDateString().slice(4, 10) + ', ' + date.toTimeString().slice(0, 5);
};