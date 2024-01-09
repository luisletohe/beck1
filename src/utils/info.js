export const generateUserErrorInfo = () => {

    return `
    Error con el usuario al ingresar sus datos
   `
}


export const generateErrorEnrutamiento = () => {

    return `
    Error de enrutamiento
   `
}


export const generateErrorDeslogueo = () => {
    return `
    Problemas para desloguearse
    `

}

export const generateErrorFile = () => {
    return `
    NO SE SUBIO EL ARCHIVO
    `

}

export const generateErrorProduct = (err) => {

    return `
    ${{ err }}
   
   `
}


export const generateErrorTicket = (err) => {
    return `
    ${{err}}
    `

}

export const generateErrorCart = (err) => {

    return `
    ${{ err }}
   
   `
}



export const generateErrorAutenticacion = () => {
    return `
   Email ya registrado / datos faltante para el registro
    `

}

export const generateAdminNoAuthorization = (info) => {
    return `
   El ${{ info }} no esta autorizado a realizar estas acciones 
    `

}