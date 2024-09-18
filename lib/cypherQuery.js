


// export const crearNodo = (nodoLabel) => {
//     return `
//     MERGE (p:${nodoLabel} {name: $valor}) RETURN p;
//     `
// }

export const crearNodo = (nodoLabel) => {
    return `
        MERGE (n:${nodoLabel} {name: $valor})
        ON CREATE SET n.nodoCreado = true
        ON MATCH SET n.nodoCreado = false
        RETURN n.nodoCreado AS nodoCreado;
    `
}


export const censuraPalabra = (palabra, censura) => {
    return `
    MATCH (p:palabra {name: "${palabra}"})
    SET p.censura = ${censura}
    RETURN p
    `
}

export const vincularDefinicionEntrada = (entrada, def, orden) => {
    return `
        MATCH (e:entrada {name: '${entrada}'})
        MATCH (d:definicion {name: '${def}'})
        CREATE (e)-[:CONTIENE_DEF {orden: ${orden}}]->(d)
    `
}



export const vincularPalabrasMetaFrase = (metaFrase, frase, palabra) => {
    return `
        MATCH (mf:${metaFrase} {name: '${frase}'})
        MATCH (p:palabra {name: '${palabra.palabra}'})
        CREATE (mf)-[:CONTIENE {orden: ${palabra.orden}}]->(p)
    `
}


export const vincularMetaFraseDefinicion = (def, metaFrase, orden) => {
    return `
        MATCH (df:definicion {name: '${def}'})
        MATCH (mf:meta_frase {name: '${metaFrase}'})
        CREATE (df)-[:DESCRIBE {orden: ${orden}}]->(mf)
    `
}

export const vincularDefinicionPalabra = (def, palabra) => {
    return `
    MATCH (df:definicion {name: '${def}'})
    MATCH (p:palabra {name: '${palabra}'})
    CREATE (df)-[:DEFINE ]->(p)
    `
}

export const vincularEntradaPalabra = (entrada) => {
    return `
    MATCH (en:entrada {name: '${entrada}'})
    MATCH (p:palabra {name: '${entrada}'})
    CREATE (en)-[:ES_ENTRADA ]->(p)
    `
}



export const retornaCantidadRelacionesPalabrasFrase = (nodo, valor) => {
    return `
        MATCH (p:${nodo} {name: '${valor}'})-[r]-()
        RETURN count(r) AS numero_de_relaciones;
    `

            


}

export const retornaListaPalabras = (criterio) => {
    return `
    MATCH (p:palabra)
    WHERE p.name CONTAINS '${criterio}' OR p.name STARTS WITH '${criterio}'
    RETURN p;
    `
}

export const retornaListaMeta_Frase = (criterio) => {
    return `
    MATCH (p:meta_frase)
    WHERE p.name CONTAINS '${criterio}' OR p.name STARTS WITH '${criterio}'
    RETURN p;
    `
}


export const borraGrafo = () => {
    return `MATCH (n)
    DETACH DELETE n;`
}


export const retornaListaDefinicionesDePalabra = (palabra) => {
    return `
        MATCH (p:palabra {name: "${palabra}"})<-[:DEFINE]-(d:definicion)
        RETURN COLLECT(d) as definiciones
    `
}




export const retornaDestructuraPalabrasMetaFrasesDefiniciones = (palabra) => {
    return `
    MATCH (p:palabra {name: "${palabra}"})-[:DEFINE]->(d:definicion)
    OPTIONAL MATCH (d)-[:DESCRIBE]->(mf:meta_frase)
    OPTIONAL MATCH (mf)-[:CONTIENE]->(w:palabra)
    RETURN COLLECT({definicion: d, meta_frases: COLLECT({meta_frase: mf, palabras: COLLECT(w)})}) as resultado

    
    `
}



export const retornaDefinicionesPalabra = (palabra) => {
    return `
    MATCH (p:palabra {name: "${palabra}"})<-[:DEFINE]-(d:definicion)
    RETURN COLLECT(d) as definiciones
    `
}

export const retornaMetaFrasesDefinicion = (definicion) => {
    return `
        MATCH (d:definicion {name: "${definicion}"})-[:DESCRIBE]->(mf:meta_frase)
        RETURN COLLECT(mf) as metafrases
    `
}


export const retornaPalabrasMetaFrase = (metaFrase) => {
    return `
        MATCH (mf:meta_frase {name: "${metaFrase}"})-[:CONTIENE]->(p:palabra)
        RETURN COLLECT(p) as palabras
    `
}

// MATCH (d1:definicion {name: "hacer que una cosa pase a otra persona transmitiendo responsabilidad"})
// MATCH (d1)-[:DESCRIBE]->(mf1:meta_frase)

// MATCH (d2:definicion)-[:DESCRIBE]->(mf2:meta_frase)
// WHERE d1 <> d2

// WITH COLLECT(DISTINCT mf1) AS metafrasesD1, d2, COLLECT(DISTINCT mf2) AS metafrasesD2

// WITH d2, [mf IN metafrasesD2 WHERE mf IN metafrasesD1] AS metafrasesEnComun, metafrasesD2
// WHERE SIZE(metafrasesEnComun) = SIZE(metafrasesD2)

// MATCH (d2)-[:DEFINE]->(palabra:palabra)

// RETURN palabra


export const retornaPalabraDefinicionFrasesComun = (definicion) => {
    return `
    MATCH (d1:definicion {name: "${definicion}"})
    MATCH (d1)-[:DESCRIBE]->(mf1:meta_frase)

    MATCH (d2:definicion)-[:DESCRIBE]->(mf2:meta_frase)
    WHERE d1 <> d2

    WITH COLLECT(DISTINCT mf1) AS metafrasesD1, d2, COLLECT(DISTINCT mf2) AS metafrasesD2

    WITH d2, [mf IN metafrasesD2 WHERE mf IN metafrasesD1] AS metafrasesEnComun, metafrasesD2
    WHERE SIZE(metafrasesEnComun) = SIZE(metafrasesD2)

    MATCH (d2)-[:DEFINE]->(palabra:palabra)

    RETURN d2, palabra, metafrasesEnComun
    `
}


export const retornaEntradasPalabra = (palabra) => {
    return `MATCH (e:entrada {name: "${palabra}"})-[r:CONTIENE_DEF]->(d:definicion)
        RETURN e, r, d
    `
}