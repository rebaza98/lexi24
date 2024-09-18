'use client'
import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud'
import HTMLFlipBook from 'react-pageflip';
import { read, write } from '@/lib/neo4j';
import { crearNodo, retornaCantidadRelacionesPalabrasFrase, retornaDefinicionesPalabra, retornaDestructuraPalabrasMetaFrasesDefiniciones, retornaMetaFrasesDefinicion, retornaPalabraDefinicionFrasesComun, retornaPalabrasMetaFrase, vincularDefinicionEntrada, vincularEntradaPalabra } from '@/lib/cypherQuery';
import { EyeIcon } from '@heroicons/react/24/outline'
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'

const definicionesCaminar = [
  { id:1, value: 'Moverse a pie', count: 38, censura: 5, prioridad: 75 },
  { id:2, value: 'Andar o avanzar paso a paso', count: 30, censura: 2, prioridad: 90 },
  { id:3, value: 'Recorrer un camino o sendero', count: 28, censura: 7, prioridad: 45 },
  { id:4, value: 'Acto de movimiento controlado', count: 25, censura: 0, prioridad: 60 },
  { id:5, value: 'Actividad física y ejercicio', count: 33, censura: 1, prioridad: 80 },
  { id:6, value: 'Figurativamente, avanzar o progresar', count: 18, censura: 8, prioridad: 30 },
  
  
  // Puedes agregar más palabras con sus frecuencias, censura y prioridad
];

const colorScale = [
  '#808080', // GRAY oscuro (censura 0)
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
  '#70B02D', //VERDE CENSURA 99 ONTOLOGIA ABSCTRACTA
];

const customRenderer = (tag, size, color) => {
  
    // Define una escala de colores basada en la censura
    

  // Asignar el color calculado en función de la censura
  const textColor = colorScale[tag.censura]

  return (
    <span key={tag.value} style={{ color:textColor, fontSize:size, cursor:"pointer" }} >
      {"{"}{tag.value}{"} "}
    </span>
  )
}


const listaWordCloud = definicionesCaminar.map((definicion) => {
      return {value: definicion.value, count: definicion.count}
})



export default function Home({params}) {
  
  const { palabra } = params

  const router = useRouter()

  //const [definiciones, setDefiniciones] = useState(definicionesCaminar)
  const [definiciones, setDefiniciones] = useState([])
  const [nuevasDefiniciones, setNuevasDefiniciones] = useState([])
  const [definicionesSeleccionadas, setDefinicionesSeleccionadas] = useState([])


  const handlerSelectDefinicion = (current) => {
    const nuevaDefiniciones = definiciones.filter((definicion) => {
      if (definicion.id !== current.id){
        return definicion
      }
    })
    setDefiniciones(nuevaDefiniciones)
    setDefinicionesSeleccionadas([...definicionesSeleccionadas, current])
  } 

  const handlerReturnDefinicion = (current) => {
    const nuevaDefiniciones = definicionesSeleccionadas.filter((definicion) => {
      if (definicion.id !== current.id){
        return definicion
      }
    })
    setDefiniciones([...definiciones, current])
    setDefinicionesSeleccionadas(nuevaDefiniciones)
  } 


  useEffect(()=> {
    
    loadData()
    
  }, [])


  const loadData = async () => {
    const toastId = toast.loading('Cargando Datos ...', { autoClose: true });
    const respuesta =  await read(2, retornaDefinicionesPalabra(palabra), {});
    console.log("respuesta", respuesta[0].definiciones)
    const defs = await Promise.all(

      respuesta[0].definiciones.map(async(current, index) => {
      console.log("Current", current.properties.name)
      let actual = {}
      let mayorCensura = 0
      let contRelaciones = 0
      actual.id = index + 1
      actual.value = current.properties.name
      const respuesta0 = await read(2, retornaPalabraDefinicionFrasesComun(actual.value), {});
      let concatenaFraseComun = ""
      respuesta0[0]?.metafrasesEnComun.map((frase, index) => {
        let igualaLength = index + 1
        if (igualaLength == respuesta0[0].metafrasesEnComun.length){
          concatenaFraseComun += frase.properties.name
        }else{
          concatenaFraseComun += frase.properties.name + " "
        }
      })
      // Definir tus strings
      const stringA = concatenaFraseComun;
      const stringB = actual.value
      const stringC = respuesta0[0]?.palabra.properties.name

      console.log("STRINGS = ", stringA, stringB, stringC)

      // Crear una expresión regular para buscar todas las ocurrencias de stringA
      const regex = new RegExp(stringA, 'g');

      // Realizar el reemplazo
      const resultadoString = stringB.replace(regex, stringC);
      if (resultadoString){
        let temp = {}
        temp.id = 100
        temp.value = resultadoString
        temp.count = 10
        temp.censura = 11

        setNuevasDefiniciones([...nuevasDefiniciones, temp])
      }
      
      
      actual.prioridad = 20
      console.log(actual)
      const respuesta2 = await read(2, retornaMetaFrasesDefinicion(actual.value), {});
       await Promise.all(
          respuesta2[0].metafrases.map(async(mf) => {
            let actualMF = mf.properties.name
            const respuesta3 = await read(2, retornaPalabrasMetaFrase(actualMF), {});
            console.log("RESPUESTA 3", respuesta3[0].palabras)
            
            await Promise.all(
              respuesta3[0].palabras.map(async(pal) => {
                let currentPalabra =  pal.properties.name
                let currentCensura = parseInt(pal.properties.censura.low)
                if (currentCensura > mayorCensura){
                  mayorCensura = currentCensura
                }
                const nroRelaciones = await read(2, retornaCantidadRelacionesPalabrasFrase("palabra", currentPalabra), {});
                console.log("NUMERO DE RELACIONES = ", nroRelaciones)
                contRelaciones += parseInt(nroRelaciones[0].numero_de_relaciones.low)
                
              })
            )
            
          })
      )
      actual.count = contRelaciones
      actual.censura = mayorCensura
      console.log()
      return actual

      
    })) 
    setDefiniciones(defs)
    toast.update(toastId, { type: 'success', render: 'Carga Terminada...', isLoading: false, autoClose: true });
  }


  const test = async () => {
    
    console.log("RPTA CLICK  = ", nuevasDefiniciones)
    nuevasDefiniciones.map((nuevaDef) => {
      setDefiniciones([...definiciones, nuevaDef])
    })
    
  }

   const handleGrabar = async () => {
    console.log("EMPIEZA GRABADO")
    const toastId = toast.loading('Grabando Datos ...', { autoClose: true });
    const nodoEntrada = "entrada"
    const flagNuevo = await write(crearNodo(nodoEntrada), {valor: palabra})
    await write (vincularEntradaPalabra(palabra), {})
    await Promise.all(
      
      definicionesSeleccionadas.map(async(def, index) => {
        
        await write(vincularDefinicionEntrada(palabra, def.value, index+1), {});

      })
    
    )
    toast.update(toastId, { type: 'success', render: 'Guardado con Exito...', isLoading: false, autoClose: true });
    router.push(`/promptOrganico/`);
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
      <main className="min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">

      <button
        type="button"
        onClick={test}
        className="rounded-full bg-orange-600 p-2 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <EyeIcon className="h-5 w-5" aria-hidden="true" />
      </button>
        
        <div className="text-5xl font-bold italic " >
          {palabra}:
        </div>
        <div className="">
          {definiciones.length > 0 && (<>
            <h1 className="mt-4 tracking-tight text-center font-bold sm:text-3xl">WordCloud</h1>

            <div className='flex justify-center' >
              <div className='w-1/2 text-center ' >
                <TagCloud
                  renderer={customRenderer}
                  minSize={12}
                  maxSize={35}
                  tags={definiciones}
                  shuffle={false}
                  // onClick={tag => alert(`'${tag.value}' was selected!`)}
                  onClick={(tag) => handlerSelectDefinicion(tag)}

                />
              </div>
            </div>

          </>)}

          <br />
          <div className="text-2xl mb-5 " >
                Prioridad de Definiciones:
          </div>
          {definicionesSeleccionadas.length > 0 && (
            definicionesSeleccionadas.map((definicion, index) => {
              return (
                <div className='pl-10 text-2xl cursor-pointer ' >
                  <p key={index} style={{color:colorScale[definicion.censura]}}    onClick={()=> {
                    handlerReturnDefinicion(definicion)
                  }} >
                    {index + 1}.- {definicion.value}.
                  </p>
                </div>

              )
            })
          )}


        </div>
        <div className='mt-10' >
          <button
            type="button"
            className="rounded-full bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={() => handleGrabar()}
          >
            Grabar
          </button>
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