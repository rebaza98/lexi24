'use client'
import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud'
import HTMLFlipBook from 'react-pageflip';
import ModalProcesaTexto from '@/components/ModalProcesaTexto';
import { read, write } from '@/lib/neo4j'

import { censuraPalabra, crearNodo, retornaCantidadRelacionesPalabrasFrase, vincularPalabrasMetaFrase } from '@/lib/cypherQuery';
import TablaResultadoPromptOrganico from '@/components/TablaResultadoPromptOrganico';
import PromptOrganicoWordCloud from '@/components/PromptOrganicoWordCloud';

const definicionesCaminar = [
  { id: 1, value: 'Moverse a pie', count: 38, censura: 5, prioridad: 75 },
  { id: 2, value: 'Andar o avanzar paso a paso', count: 30, censura: 2, prioridad: 90 },
  { id: 3, value: 'Recorrer un camino o sendero', count: 28, censura: 7, prioridad: 45 },
  { id: 4, value: 'Acto de movimiento controlado', count: 25, censura: 3, prioridad: 60 },
  { id: 5, value: 'Actividad física y ejercicio', count: 33, censura: 1, prioridad: 80 },
  { id: 6, value: 'Figurativamente, avanzar o progresar', count: 18, censura: 8, prioridad: 30 },


  // Puedes agregar más palabras con sus frecuencias, censura y prioridad
];

const colorScale = [
  '#00008B', // Azul oscuro (censura 0)
  '#0000FF', // Azul menos oscuro (censura 1)
  '#4169E1', // Azul menos oscuro que el anterior (censura 2)
  '#FFA500', // Naranja (censura 3)
  '#FF8C00', // Naranja menos oscuro que el anterior (censura 4)
  '#FF6347', // Naranja menos oscuro que el anterior (censura 5)
  '#FF4500', // Rojo menos oscuro que el anterior (censura 6)
  '#DC143C', // Rojo menos oscuro que el anterior (censura 7)
  '#DC143C', // Rojo menos oscuro que el anterior (censura 8)
  '#DC143C', // Rojo menos oscuro que el anterior (censura 9)
  '#FF0000', // Rojo (censura 10)
];

const customRenderer = (tag, size, color) => {

  // Define una escala de colores basada en la censura


  // Asignar el color calculado en función de la censura
  const textColor = colorScale[tag.censura]

  return (
    <span key={tag.value} style={{ color: textColor, fontSize: size, cursor: "pointer" }} >
      {"{"}{tag.value}{"} "}
    </span>
  )
}


const listaWordCloud = definicionesCaminar.map((definicion) => {
  return { value: definicion.value, count: definicion.count }
})

const palabra = "caminar"

const nodoPalabra = "palabra"
const nodoMetaFrase = "meta_frase"


export default function PromptOrganicoHome() {

  const [textoIngresado, setTextoIngresado] = useState("")
  const [textoProcesado, setTextoProcesado] = useState([])
  const [fraseProcesada, setFraseProcesada] = useState("")
  const [openModalProcesaTexto, setOpenModalProcesaTexto] = useState(false)
  const [muestraTabla, setMuestraTabla] = useState(false)
  const [textoWordCloud, setTextoWordlCloud] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [fraseNueva, setFraseNueva] = useState(false)

  setTextoProcesado
  isSubmitting

  const [grabar, setGrabar] = useState(false)

  useEffect( () => {
    
    console.log("TEXTO EFFECT", textoProcesado)

    // const arrAct = textoProcesado.map((palabra) => {
    //   console.log("REMOVER = palabra = ", palabra)
    //   return {
    //     value: palabra.palabra, count: palabra.nroRelaciones, censura: (Math.floor(Math.random() * 10) + 1)
    //   }
    // })

    // setTextoWordlCloud(arrAct)

    

  }, [textoProcesado] )

  const grabarFrase = async () => {
    console.log("EMPIEZA GRABADO...");
    
    // REVISAR SI PALABRAS SE REPITEN EN TEXTO NUEVO
  
    let arregloActualizado = [...textoProcesado];
  
    // Utiliza Promise.all para esperar todas las operaciones asincrónicas
    await Promise.all(textoProcesado.map(async (objPalabra, indice) => {
      const flagNuevo = await write(crearNodo(nodoPalabra), { valor: objPalabra.palabra });
      console.log("FLAG NUEVO =", flagNuevo[0]);
      arregloActualizado[indice].nuevo = flagNuevo[0].nodoCreado;
      console.log("arregloActualizado[indice].nuevo =", arregloActualizado[indice].nuevo);
      await write(censuraPalabra(objPalabra.palabra, objPalabra.censura), {})
    }));
  
    // Graba frase solo si existe más de una palabra
    let flagFraseNuevo = false;
    if (textoProcesado.length > 1) {
      flagFraseNuevo = await write(crearNodo(nodoMetaFrase), { valor: fraseProcesada });
      console.log("ES FRASE NUEVA ? = ", flagFraseNuevo[0].nodoCreado)
      setFraseNueva(flagFraseNuevo[0].nodoCreado)
      if (flagFraseNuevo[0].nodoCreado){
        await Promise.all(textoProcesado.map(async (objPalabra) => {
          await write(vincularPalabrasMetaFrase(nodoMetaFrase, fraseProcesada, objPalabra), {});
        }));
      } 
      
    }
  
    // Utiliza Promise.all nuevamente para esperar todas las operaciones asincrónicas
    await Promise.all(textoProcesado.map(async (objPalabra, indice) => {
      const nroRelaciones = await read(2, retornaCantidadRelacionesPalabrasFrase(nodoPalabra, objPalabra.palabra), {});
      console.log("NRO RELACIONES =", nroRelaciones[0].numero_de_relaciones.low);
      arregloActualizado[indice].nroRelaciones = nroRelaciones[0].numero_de_relaciones.low
    }));
    
    console.log("SETEA TEXTO PROCESADO");
    const arrAct = arregloActualizado.map((palabra) => {
      console.log("REMOVER = palabra = ", palabra)
      return {
        value: palabra.palabra, count: palabra.nroRelaciones, censura: palabra.censura
      }
    })
    console.log("QUWDAONDO = ", arrAct)
    setTextoWordlCloud(arrAct)
    setTextoProcesado(arregloActualizado);
  
    // Actualizar el estado si es necesario
    //setTextoIngresado('');
    setGrabar(false);
    setIsSubmitting(false)
    setOpenModalProcesaTexto(false);
    setMuestraTabla(true)
  };
  

  useEffect( () => {textoProcesado
    if(grabar){
      grabarFrase()
    }
    

  }, [grabar] )


  
  
  
  // Función para procesar y dividir una cadena en palabras
  function procesarTexto() {
    // Eliminar espacios en blanco al principio y al final
    let texto = textoIngresado.trim();

    // Eliminar símbolos de puntuación y caracteres no alfabéticos
    texto = texto.replace(/[^a-zA-Z\s]/g, '');

    // Dividir la cadena en palabras individuales
    const palabras = texto.split(/\s+/);

    const objPalabras = palabras.map((palabra, index) => {
      return {palabra, orden: index, nroRelaciones: 0, censura:0, nuevo:false}
    })

    console.log("Palabras = ", palabras)
    console.log("TEXTO = ", texto)

    setTextoProcesado(objPalabras)
    setFraseProcesada(texto)
    setOpenModalProcesaTexto(true)
  }

  

  // Manejar cambios en el textarea
  function handleTextoChange(e) {
    setTextoIngresado((e.target.value).toLowerCase())
  }

  

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="min-h-full place-items-center bg-white px-6 py-24 sm:py-10 lg:px-8">
      <h1 className=" text-xl text-center mb-10 font-semibold leading-6 text-gray-900">PROMPT ORGANICO</h1>
        {openModalProcesaTexto && <ModalProcesaTexto open={openModalProcesaTexto} setOpen={setOpenModalProcesaTexto} textoProcesado={textoProcesado} setTextoProcesado={setTextoProcesado} setGrabar={setGrabar} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} /> }
        {!muestraTabla && (
          <>
          <div className='flex justify-center'  >
        
        <div className="w-1/2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-900">
            Ingrese alguna palabra o frase
          </label>
          <div className="mt-2">
            <textarea
              rows={2}
              defaultValue={textoIngresado}
              onChange={handleTextoChange}
              name="comment"
              id="comment"
              className="block w-full lowercase rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
            />
          </div>
          
        </div>
        
      </div>
      <div className='flex justify-center mt-2' >
        <button
          type="button"
          onClick={procesarTexto}
          className="rounded-full bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Procesar
        </button>
      </div>
          </>
        )}  
        
        <div>
        {muestraTabla && <PromptOrganicoWordCloud definiciones={textoWordCloud} />}
        </div>
        <div>
          {muestraTabla && <TablaResultadoPromptOrganico textoProcesado={textoProcesado} fraseProcesada={fraseProcesada} fraseNueva={fraseNueva} />}
          
        </div>

        {/* <div className='flex justify-center' >
          <HTMLFlipBook  width={500} height={500}>
            <div className="page">
              {palabra}
              <div className='page  page-text' >
                {definicionesSeleccionadas.length > 0 && (
                  definicionesSeleccionadas.map((definicion, index) => {
                    return (
                      <div className='page-text ' >
                        <p key={index} >
                          {index + 1}.- {definicion.value}
                        </p>
                      </div>

                    )
                  })
                )}

              </div>
            </div>
            <div className="page">
                Page 2
                <p className='page page-content page-text' >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit ea nisi repellat impedit harum laudantium maiores sit cum quo ab nostrum debitis repudiandae fugiat rem neque tempora minus, ipsum laborum?
                </p>
              </div>
              <div className="page">
                Page 3
                <p className='page page-content page-text' >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit ea nisi repellat impedit harum laudantium maiores sit cum quo ab nostrum debitis repudiandae fugiat rem neque tempora minus, ipsum laborum?
                </p>
                </div>
              <div className="page">Page 4</div>
          </HTMLFlipBook>
        </div> */}
      </main>
    </>
  )
}