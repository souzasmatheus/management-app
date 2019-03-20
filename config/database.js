if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURL: 'mongodb://souzasmatheus:81218525Matheus@ds117846.mlab.com:17846/housing'}
} else {
    module.exports = {mongoURL: 'mongodb://localhost/management'}
}