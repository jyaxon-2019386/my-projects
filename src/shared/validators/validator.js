export const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

export const emailValidationMessage = 'Please enter a correct email!'

/* --- ------------------ VALIDACION EMAIL ----------------------*/ 

/* --- ------------------ VALIDACION USERNAME ----------------------*/ 
export const validateUsername = (username) => {
    const regex = /^\S{3,8}$/
    return regex.test(username)
}

export const usernameValidationMessage = 'Username must be between 3 to 8 characters'

/* --- ------------------ VALIDACION PASSWORD ----------------------*/ 
export const validatePassword = (password) => {
    const regex = /^\S{6,12}$/
    return regex.test(password)
}

export const passwordValidationMessage = 'Password must be betwen 6 to 12 characters'

/* --- ------------------ VALIDACION PASSWORD ----------------------*/ 
export const validatePasswordConfirm = (password, passConfirm) => {
    return password === passConfirm
}

export const passConfirmValidationMessage = 'La contrasena no coincide!'