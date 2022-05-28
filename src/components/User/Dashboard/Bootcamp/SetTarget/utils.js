export const timeOptions = [
    "12:00 am",
    "1:00 am",
    "2:00 am",
    "3:00 am",
    "4:00 am",
    "5:00 am",
    "6:00 am",
    "7:00 am",
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "7:00 pm",
    "8:00 pm",
    "9:00 pm",
    "10:00 pm",
    "11:00 pm"
]

export const getDay = (d) =>
{
    switch (d)
    {
        case "Mo":
            return "Monday";
        case "Tu":
            return "Tuesday";
        case "Wd":
            return "Wednesday";
        case "Th":
            return "Thursday";
        case "Fr":
            return "Friday";
        case "Sa":
            return "Saturday";
        case "Su":
            return "Sunday";
    }
};

export const schedule = [
    "Mo",
    "Tu",
    "Wd",
    "Th",
    "Fr",
    "Sa",
    "Su",
];

export const goal = [2, 3, 4, 5, 6, "everyday"];

export const getDayInNo = (day) =>
{
    switch (day)
    {
        case "Su": return 0;
        case "Mo": return 1;
        case "Tu": return 2;
        case "Wd": return 3;
        case "Th": return 4;
        case "Fr": return 5;
        case "Sa": return 6;
        default: return null;
    }
}

export const findNextDate = (dayName, excludeToday = true, refDate = new Date()) =>
{
    const dayOfWeek = ["su", "mo", "tu", "wd", "th", "fr", "sa"].indexOf(dayName.toLowerCase());
    if (dayOfWeek < 0) return;
    refDate.setHours(0, 0, 0, 0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    return refDate;
}

export const sort_days = (days) =>
{
    var daysOfWeek = ["Su", "Mo", "Tu", "Wd", "Th", "Fr", "Sa"];
    var today = new Date().getDay();
    for (var i = 0; i < today; i++) daysOfWeek.push(daysOfWeek.shift());
    return daysOfWeek.filter(function (d) { return days.indexOf(d) >= 0; });
}