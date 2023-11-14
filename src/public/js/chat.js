const message = document.getElementById('message')
const received_messages = document.getElementById('received_messages')
const socket = io()
const users = [
    { id: 1, firstName: 'Valentin', lastName: 'Barrena', userName: 'vbarrena' },
    { id: 2, firstName: 'Carolina', lastName: 'Ferrero', userName: 'cferrero' },
    { id: 3, firstName: 'Juan', lastName: 'Perez', userName: 'jperez' }
]
let user

socket.on('messageLogs', data => {
    let messages = ''
    let log = document.getElementById('messageLogs')
    data.forEach(val => {
        messages += `${val.user.firstName} dice: ${val.message} <br />`
    });

    received_messages.innerHTML = messages
})

socket.on('user_connected', data => {
    Swal.fire({
        text: `${data.user.firstName} ${data.user.lastName} se ha conectado!`,
        toast: true,
        position: 'top-right'
    })
})

const sendMessage = () => {
    if (message.value.trim() !== '') {
        socket.emit('message', { user: user , message: message.value.trim() })
        message.value = ''
    }
}

const authenticate = () => {
Swal.fire({
    title: 'Login',
    input: "text",
    text: 'Ingresar usuario:',
    inputValidator: (value) => {
        return !value && 'Por favor ingresar usuario'
    },
    allowOutsideClick: false
}).then(res => {
    // user = res.value
    user = users.find(item=> item.userName === res.value)
    if (user !== undefined) {
        //El servidor socket.io tiene que enviar el array de mensajes
        socket.emit('user_connected', {user: user})
    } else {
        // Mensaje de error
        Swal.fire({
            text: 'Usuario no válido',
            toast: true,
            position: 'top-right'
        }).then(res => {
            authenticate()
        })
    }
})
}

authenticate()