const mongoose = require('mongoose')
const dateFns = require('date-fns')

// Load Client Model
require('../models/Client')
const Client = mongoose.model('clients')


module.exports = {
    getNames: (clients => {
        let names = clients.filter(client => {
            const birthday = client.birthday.split('-')

            const result = dateFns.isThisMonth(new Date(new Date().getFullYear(), birthday[1] - 1, birthday[2]))

            return result
        }).map(client => {
            const birthday = client.birthday.split('-')
            return `${client.name} (${birthday[2]}/${birthday[1]})`
        })

        if (names.length > 0) {
            return `Os aniversariantes do mês são:<br>${names.join('<br>')}<br>Não esqueça de dar os parabéns!`
        } else {
            return null
        }
    })
}