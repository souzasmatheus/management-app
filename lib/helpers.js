const dateFns = require('date-fns')

module.exports = {
    getAge: (date) => {
        const birthyear = date.split('-')[0]
        const age = new Date().getFullYear() - birthyear
        return age
    },
    toBrazilianFormat: (date) => {
        const dateArray = date.split('-')

        const result = dateFns.format(
            new Date(dateArray[0], dateArray[1] - 1, dateArray[2]),
            'DD/MM/YYYY'
        )
        return result
    },
    getSumOfDays: (checkins) => {
        let totalOfDays = 0
        checkins.forEach((checkin) => {
            let days = dateFns.differenceInDays(
                new Date(checkin.checkout),
                new Date(checkin.checkin)
            )
            totalOfDays += days
        })
        return totalOfDays
    }
}