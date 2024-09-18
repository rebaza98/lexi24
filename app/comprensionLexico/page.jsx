'use client'
import { useState } from 'react';
import { TagCloud } from 'react-tagcloud'
import HTMLFlipBook from 'react-pageflip';

const definicionesCaminar = [
  { id:1, value: 'Moverse a pie', count: 50, censura: 5, prioridad: 75 },
  { id:2, value: 'Andar o avanzar paso a paso', count: 40, censura: 2, prioridad: 90 },
  { id:3, value: 'y', count: 80, censura: 7, prioridad: 45 },
  { id:4, value: 'Acto de movimiento controlado', count: 25, censura: 3, prioridad: 60 },
  { id:5, value: 'que', count: 60, censura: 1, prioridad: 80 },
  { id:6, value: 'Figurativamente, avanzar o progresar', count: 18, censura: 8, prioridad: 30 },
  
  
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
    <span key={tag.value} style={{ color:textColor, fontSize:size, cursor:"pointer" }} >
      {"{"}{tag.value}{"} "}
    </span>
  )
}


const listaWordCloud = definicionesCaminar.map((definicion) => {
      return {value: definicion.value, count: definicion.count}
})

const palabra = "mecanica"

export default function Example() {
  
  const [definiciones, setDefiniciones] = useState(definicionesCaminar)
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