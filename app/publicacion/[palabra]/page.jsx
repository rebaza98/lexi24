'use client'
import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud'
import HTMLFlipBook from 'react-pageflip';
import { read, write } from '@/lib/neo4j';
import { crearNodo, retornaCantidadRelacionesPalabrasFrase, retornaDefinicionesPalabra, retornaDestructuraPalabrasMetaFrasesDefiniciones, retornaEntradasPalabra, retornaMetaFrasesDefinicion, retornaPalabraDefinicionFrasesComun, retornaPalabrasMetaFrase, vincularDefinicionEntrada, vincularEntradaPalabra } from '@/lib/cypherQuery';
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
    const respuesta =  await read(2, retornaEntradasPalabra(palabra), {});
    console.log("respuesta", respuesta)
    let defs = []
    for (const rpta of respuesta){
      console.log("ver :", rpta.d.properties.name)
      defs.push(rpta.d.properties.name)
    }
    setDefiniciones(defs)
    //setDefiniciones(defs)
    toast.update(toastId, { type: 'success', render: 'Carga Terminada...', isLoading: false, autoClose: true });
  }


  const test = async () => {
    
    console.log("RPTA CLICK  = ", nuevasDefiniciones)
    let defs = []
    nuevasDefiniciones.map((nuevaDef) => {
      //setDefiniciones([...definiciones, nuevaDef])
    })
    
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

    
        
        <div className="text-5xl font-bold italic " >
          {palabra}:
        </div>
        
        
        <div className='mt-8 flex justify-center' >
          <HTMLFlipBook  width={500} height={500}>
            <div className="page">
              {palabra}
              <div className='page  page-text' >
                {definiciones.length > 0 && (
                  definiciones.map((definicion, index) => {
                    return (
                      <div className='page-text ' >
                        <p key={index} >
                          {index + 1}.- {definicion}
                        </p>
                      </div>

                    )
                  })
                )}

              </div>
            </div>
            {/* <div className="page">
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
              <div className="page">Page 4</div> */}
          </HTMLFlipBook>
        </div>
      </main>
    </>
  )
}