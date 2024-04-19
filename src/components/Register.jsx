import { isValidElement, useState } from "react";
import { Input } from "./Input";
import { emailValidationMessage, passConfirmValidationMessage, passwordValidationMessage, usernameValidationMessage, validateEmail, validatePassword, validatePasswordConfirm, validateUsername } from "../shared/validators/validator";
import { userRegister } from "../shared/hooks/userRegister.jsx";

export const Register = ({switchAuthHandler}) => {
    const { register, isLoading } = userRegister()

    const [ formData, setFormData ] = useState(
        {
            email: {
                value: '',
                isValid: false,
                showError: false
            },
            username: {
                value: '',
                isValid: false,
                showError: false
            },
            password: {
                value: '',
                isValid: false,
                showError: false    
            },
            passwordConfirm: {
                value: '',
                isValid: false,
                showError: false
            }
        }
    )

    const isSubmitButtonDisable = !formData.email.isValid || 
                                  !formData.username.isValid ||
                                  !formData.password.isValid ||
                                  !formData.passwordConfirm.isValid

    const handleValueChange = (value, field) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [field]: {
                    ...prevData[field],
                    value
                }
            }
        ))
    }

    const handlerValidationOnBlur = (value, field) => {
        let isValid = false
        switch(field){
            case 'email':
                isValid = validateEmail(value)
                break
            case 'username':
                isValid = validateUsername(value)
                break
            case 'password':
                isValid = validatePassword(value)
                break
            case 'passwordConfirm':
                isValid = validatePasswordConfirm(formData.password.value, value)
                break
            default:
            break
        }
        setFormData((prevData) => (
            {
                ...prevData,
                [field]: {  
                    ...prevData[field],
                    isValid,
                    showError: !isValid
                }
            }
        ))
        
    }

    const handleRegister = async(e) =>{
        e.preventDefault()
        register(            
                formData.email.value,
                formData.username.value,
                formData.password.value
        )
    }

  return (
    <div className="register-container">
        <form className="auth-form"
         onSubmit={handleRegister}
         >
            <Input 
                field='email'
                label='Email'
                value={formData.email.value}
                onChangeHandler={handleValueChange}
                type='email'
                onBlurHandler={handlerValidationOnBlur}
                showErrorMessage={formData.email.showError}
                validationMessage={emailValidationMessage}
            />

            <Input 
                field='username'
                label='Username'
                value={formData.username.value}
                onChangeHandler={handleValueChange}
                type='text'
                onBlurHandler={handlerValidationOnBlur}
                showErrorMessage={formData.username.showError}
                validationMessage={usernameValidationMessage}
            />

            <Input 
                field='password'
                label='Password'
                value={formData.password.value}
                onChangeHandler={handleValueChange}
                type='password'
                onBlurHandler={handlerValidationOnBlur}
                showErrorMessage={formData.password.showError}
                validationMessage={passwordValidationMessage}
            />

            <Input 
                field='passwordConfirm'
                label='Password Confirmation'
                value={formData.passwordConfirm.value}
                onChangeHandler={handleValueChange}
                type='password'
                onBlurHandler={handlerValidationOnBlur}
                showErrorMessage={formData.passwordConfirm.showError}
                validationMessage={passConfirmValidationMessage}
            />

            <button disabled={isSubmitButtonDisable}
            >
                Register
            </button>
        </form>
        <span onClick={switchAuthHandler}>
            ¿Tienes ya una cuenta? Inicia sesion
        </span>
    </div>
  )
}
