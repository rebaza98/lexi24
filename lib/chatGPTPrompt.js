export const retornaPromptRelaciones = (palabra) => {

    function tieneMasDeUnaPalabra(texto) {
        // Divide el texto en palabras usando el espacio en blanco como separador
        const palabras = texto.split(' ');
      
        // Filtra las palabras vacías (debido a espacios en blanco adicionales)
        const palabrasNoVacias = palabras.filter(palabra => palabra.trim() !== '');
      
        // Si hay más de una palabra no vacía, el string tiene más de una palabra
        console.log("LLEGA AQUI", palabrasNoVacias.length > 1)
        return palabrasNoVacias.length > 1;
      }
    if (tieneMasDeUnaPalabra(palabra)){
        return `Deseo que me retornes en una escala del 1 al 100 que tanta coherencia crees que tiene el texto siguiente:
        ${palabra}
        retorname el valor del 1 al 100
        `
    }else{
        return `deseo que me muestres una lista de palabras relacionadas a una palabra , de manera que me des una descripcion o definicion de las palabras de la lista pero que las definiciones guarden cierta relacion con otras palabras de la lista, por ejemplo:
        palabra  : dar
        dar: hacer que una cosa pase a otra persona 
        entregar : hacer que una cosa pase a otra persona transmitiendo responsabilidad
        conceder: hacer que una cosa pase a otra persona por la autoridad que se tiene
        y asi.., pero ahora hazlo con la palabra "${palabra}"  
        adjunto este ejemplo 2 que usa palabras relacionadas a objetivo para que te ayude a generar esta respuesta
        ejemplo 2:
        
        1. Meta: Un objetivo específico y medible que se desea alcanzar.
        Ejemplo de relación: Un objetivo es una meta, pero no todas las metas son objetivos.
    
        2. Propósito: La razón o intención detrás de un objetivo.
        Ejemplo de relación: El propósito guía la elección de un objetivo y le da significado.
    
        3. Finalidad: El objetivo o razón por la cual algo se hace o se lleva a cabo.
        Ejemplo de relación: La finalidad de un objetivo es lograr un resultado deseado.
    
        4. Destino: El resultado o logro al que se aspira alcanzar con un objetivo.
        Ejemplo de relación: El destino es el punto final hacia el cual se dirige un objetivo.
    
        5. Ambición: Un objetivo o deseo fuerte de lograr algo importante.
        Ejemplo de relación: La ambición impulsa a establecer objetivos desafiantes y a trabajar para alcanzarlos.`
    }
    
    
    
    // return `deseo que me muestres una lista de palabras relacionadas a una palabra , de manera que me des una deescripcion o definicion de las palabras de la lista pero que las definiciones guarden cierta relacion con otras palabras de la lista, por ejemplo:
    // palabra  : dar
    // dar: hacer que una cosa pase a otra persona 
    // entregar : hacer que una cosa pase a otra persona transmitiendo responsabilidad
    // conceder: hacer que una cosa pase a otra persona por la autoridad que se tiene
    // y asi.., pero ahora hazlo con la palabra "${palabra}" me entiendes? 
    // adjunto este ejemplo 2 que usa palabras relacionadas a objetivo para que te ayude a generar esta respuesta
    // ejemplo 2:
    // 1. Meta: Un objetivo específico y medible que se desea alcanzar.
    // Ejemplo de relación: Un objetivo es una meta, pero no todas las metas son objetivos.

    // 2. Propósito: La razón o intención detrás de un objetivo.
    // Ejemplo de relación: El propósito guía la elección de un objetivo y le da significado.

    // 3. Finalidad: El objetivo o razón por la cual algo se hace o se lleva a cabo.
    // Ejemplo de relación: La finalidad de un objetivo es lograr un resultado deseado.

    // 4. Destino: El resultado o logro al que se aspira alcanzar con un objetivo.
    // Ejemplo de relación: El destino es el punto final hacia el cual se dirige un objetivo.

    // 5. Ambición: Un objetivo o deseo fuerte de lograr algo importante.
    // Ejemplo de relación: La ambición impulsa a establecer objetivos desafiantes y a trabajar para alcanzarlos.
    // me entiendes, no agregues frases introductorias?
    // `
}

export const retornaPromptCoherencia = (texto) => {
    return `Deseo que me retornes en una escala del 1 - 100 que tanta coherencia tiene el texto siguiente:
    ${texto}
    retorname el valor
    `
}