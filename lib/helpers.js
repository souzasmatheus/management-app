const dateFns = require('date-fns')

module.exports = {
    checkMaster: (user) => {
        if (user && user.email === 'matheu.sk.9@hotmail.com') {
            return (
                `<div class="dropdown-divider"></div>
                <a class="dropdown-item" href="/user/register">Registrar</a>`
            )
        }
    },
    getAge: (date) => {
        if (!date) {
            return 'Não especificada'
        }

        const birthyear = date.split('-')

        const result = dateFns.differenceInYears(
            new Date(),
            new Date(birthyear[0], birthyear[1] - 1, birthyear[2])
        )

        return result

        /*const birthyear = date.split('-')[0]
        const age = new Date().getFullYear() - birthyear
        return age*/
        
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
    },
    getSumOfPayments: (checkins) => {
        let totalOfPayments = 0
        checkins.forEach((checkin) => {

            totalOfPayments += Number(checkin.payment)
        })
        return totalOfPayments
    },
    getTotalMedian: (checkins) => {
        let totalOfDays = 0
        checkins.forEach((checkin) => {
            let days = dateFns.differenceInDays(
                new Date(checkin.checkout),
                new Date(checkin.checkin)
            )
            totalOfDays += days
        })

        let totalOfPayments = 0
        checkins.forEach((checkin) => {

            totalOfPayments += Number(checkin.payment)
        })

        const result = totalOfPayments / totalOfDays

        if (isNaN(result)) { return 0 } else { return result.toFixed(2) }
    },
    getMostVisitedMonth: (checkins) => {
        let visits = 0

        let selectedMonths = []

        let months = {
            Janeiro: 0,
            Fevereiro: 0,
            Março: 0,
            Abril: 0,
            Maio: 0,
            Junho: 0,
            Julho: 0,
            Agosto: 0,
            Setembro: 0,
            Outubro: 0,
            Novembro: 0,
            Dezembro: 0
        }

        checkins.forEach((checkin) => {
            const month = checkin.checkin.split('-')[1]
            switch (month) {
                case '01':
                    months.Janeiro++
                    break
                case '02':
                    months.Fevereiro++
                    break
                case '03':
                    months.Março++
                    break
                case '04':
                    months.Abril++
                    break
                case '05':
                    months.Maio++
                    break
                case '06':
                    months.Junho++
                    break
                case '07':
                    months.Julho++
                    break
                case '08':
                    months.Agosto++
                    break
                case '09':
                    months.Setembro++
                    break
                case '10':
                    months.Outubro++
                    break
                case '11':
                    months.Novembro++
                    break
                case '12':
                    months.Dezembro++
                    break
            }
        })

        for (var month in months) {
            if(months[month] > visits) {
                visits = months[month]
            }
        }

        for (var month in months) {
            if(months[month] === visits) {
                selectedMonths.push(month)
            }
        }


        return selectedMonths.join(' | ') + ' (' + visits + '/mês)'
    },
    getIndividualMedian: (checkout, checkin, payment) => {
        let days = dateFns.differenceInDays(
            new Date(checkout),
            new Date(checkin)
        )
        const result = payment / days
        return result.toFixed(2)
    }
}