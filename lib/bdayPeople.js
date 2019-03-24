const mongoose = require('mongoose')
const dateFns = require('date-fns')

// Load Client Model
require('../models/Client')
const Client = mongoose.model('clients')


module.exports = {
    getNames: (clients => {
        let names = clients.filter(client => {
            const birthdayArray = client.birthday.split('-')

            const today = new Date()

            const birthday = new Date(today.getFullYear(), birthdayArray[1] - 1, birthdayArray[2])
            const in29Days = dateFns.addDays(today, 29)
            const in31Days = dateFns.addDays(dateFns.addMonths(today, 1), 1)

            const result = dateFns.isWithinRange(
                birthday, in29Days, in31Days
            )

            console.log(`result: ${result}`)

            return result
        }).map(client => {
            const birthday = client.birthday.split('-')
            return `${client.name} (${birthday[2]}/${birthday[1]})`
        })

        if (names.length > 0) {
            return `Em cerca de 1 mês, será aniversário de:<br>
            <strong>${names.join('<br>')}</strong><br>
            Não esqueça de dar os parabéns! <i class="fas fa-glass-cheers"></i>`
        } else {
            return null
        }
    })
}