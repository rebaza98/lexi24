import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'



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


export default function ModalProcesaTexto({open, setOpen, textoProcesado, setTextoProcesado, setGrabar, isSubmitting, setIsSubmitting}) {
  //const [open, setOpen] = useState(true)


  const cancelButtonRef = useRef(null)

  const handleClickPalabra = (palabra, indice) => {
    const censuraActual = palabra.censura || 0;
    const nuevaCensura = (censuraActual + 1) % 11;

    let arregloActualizado = [...textoProcesado]
    
    arregloActualizado[indice].censura = nuevaCensura
    setTextoProcesado(arregloActualizado)
    



  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={()=>{}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    
                  </div>
                  <p className='text-sm text-center text-gray-500' > Haga Click en cada palabra para agregar grado de censura </p>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="text-3xl text-gray-500">
                      <strong>{"["}</strong>
                        
                        {textoProcesado.map((objPalabra, index) => {
                            if (index == (textoProcesado.length - 1)){
                                return <span key={index} style={{ color:colorScale[objPalabra.censura], cursor:"pointer", userSelect: "none"  }} onClick={()=>{handleClickPalabra(objPalabra, index)}} >{objPalabra.palabra}</span> 
                            }
                            return <span key={index}  style={{ color:colorScale[objPalabra.censura], cursor:"pointer", userSelect: "none" }} onClick={()=>{handleClickPalabra(objPalabra, index)}} >{objPalabra.palabra + " "}</span> 
                        })}
                        <strong>{"]"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:col-start-2"
                    onClick={() => {
                      setIsSubmitting(true)
                      setGrabar(true)}}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}



// import { Fragment, useRef, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { CheckIcon } from '@heroicons/react/24/outline';

// const colorScale = [
//   '#00008B', // Azul oscuro (censura 0)
//   '#0000FF', // Azul menos oscuro (censura 1)
//   '#4169E1', // Azul menos oscuro que el anterior (censura 2)
//   '#FFA500', // Naranja (censura 3)
//   '#FF8C00', // Naranja menos oscuro que el anterior (censura 4)
//   '#FF6347', // Naranja menos oscuro que el anterior (censura 5)
//   '#FF4500', // Rojo menos oscuro que el anterior (censura 6)
//   '#DC143C', // Rojo menos oscuro que el anterior (censura 7)
//   '#DC143C', // Rojo menos oscuro que el anterior (censura 8)
//   '#DC143C', // Rojo menos oscuro que el anterior (censura 9)
//   '#FF0000', // Rojo (censura 10)
// ];

// export default function ModalProcesaTexto({
//   open,
//   setOpen,
//   textoProcesado,
//   setGrabar,
//   isSubmitting,
//   setIsSubmitting,
// }) {
//   const cancelButtonRef = useRef(null);

//   const [censuraPorPalabra, setCensuraPorPalabra] = useState({});

//   const handleClickPalabra = (palabra) => {
//     // Obtiene la censura actual de la palabra o establece 0 si es la primera vez que se hace clic
//     const censuraActual = censuraPorPalabra[palabra] || 0;

//     // Calcula la nueva censura (reinicia a 0 si llega a 10)
//     const nuevaCensura = (censuraActual + 1) % 11;

//     // Actualiza el estado de censura
//     setCensuraPorPalabra({
//       ...censuraPorPalabra,
//       [palabra]: nuevaCensura,
//     });
//   };

//   return (
//     <Transition.Root show={open} as={Fragment}>
//       {/* Resto del código omitido para brevedad */}

//       <div className="mt-2">
//         <div className="text-xl">
//           <strong>{"["}</strong>
//           {textoProcesado.map((objPalabra, index) => {
//             const { palabra } = objPalabra;

//             // Obtiene la censura actual para esta palabra
//             const censura = censuraPorPalabra[palabra] || 0;

//             return (
//               <span
//                 key={palabra}
//                 onClick={() => {
//                   handleClickPalabra(palabra);
//                 }}
//                 style={{ color: colorScale[censura], cursor: "pointer" }} // Agregamos cursor: "pointer" para indicar que es clickeable
//               >
//                 {palabra}
//               </span>
//             );
//           })}
//           <strong>{"]"}</strong>
//         </div>
//       </div>

//       {/* Resto del código omitido para brevedad */}
//     </Transition.Root>
//   );
// }
