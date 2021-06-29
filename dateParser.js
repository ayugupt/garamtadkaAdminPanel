function getFormattedDate(date){
    year = date.getFullYear();
    month = (date.getMonth()+1).toString().padStart(2, '0');
    day = (date.getDate()).toString().padStart(2, '0');

    hours = (date.getHours()).toString().padStart(2, '0');
    minutes = (date.getMinutes()).toString().padStart(2, '0');
    seconds = (date.getSeconds()).toString().padStart(2, '0');
    milliSeconds = (date.getMilliseconds()).toString().padStart(3, '0');    

    return {
        date: `${year}_${month}_${day}`,
        time: `${hours}_${minutes}_${seconds}_${milliSeconds}`
    }

}

module.exports = getFormattedDate;