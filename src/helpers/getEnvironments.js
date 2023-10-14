export const getEnvironments = () => {
    import.meta.env //cargamos las variables
    return {
        ...import.meta.env, //se muestran las variables
    }
}