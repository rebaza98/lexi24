'use client'
import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud'
import HTMLFlipBook from 'react-pageflip';
import { toast } from 'react-toastify'
import BuscarPalabras from '@/components/polisemia/BuscarPalabras';

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

const palabra = "caminar"

export default function Example() {
  
  const [definiciones, setDefiniciones] = useState(definicionesCaminar)
  const [definicionesSeleccionadas, setDefinicionesSeleccionadas] = useState([])


  // useEffect(() => {
  //   toast.error('Ingrese Un Nombre o Razon Social', {
  //     position: "top-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "colored",
  // });
  // }, [])

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

      <div className="w-1/2">
          <label  className="block text-sm font-medium text-gray-900">
            Ingrese alguna palabra 
          </label>
          <div className="mt-2">
            <BuscarPalabras />
          </div>
        </div>
      </main>
    </>
  )
}