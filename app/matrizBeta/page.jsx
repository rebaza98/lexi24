'use client'

//import CModalProducto from "@/components/inventario/producto/CModalProducto"
import { Transition } from "@headlessui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import styles from "./styles.module.css"
import { PhotoIcon, UserCircleIcon, PlusIcon, MinusIcon} from '@heroicons/react/24/solid'
import ModalDefinicion from "@/components/ModalDefinicion"

import { Tooltip } from "react-tooltip"

// const pages = [
//     { name: 'Inventario', href: '#', current: false },
//     { name: 'Productos', href: '/inventario/productos', current: true },
//   ]

const MatrizBetaHome = () => {

    const [dataSet, setDataSet] = useState(
        {
            palabras : [
                { id:1, palabra: 'Creatividad', definiciones : [], sinonimos: []},
                { id:2, palabra: 'Amistad', definiciones : [], sinonimos: []},
                { id:3, palabra: 'Innovación', definiciones : [], sinonimos: []},
                { id:4, palabra: 'Felicidad', definiciones : [], sinonimos: []},
                { id:5, palabra: 'Éxito', definiciones : [], sinonimos: []},
                { id:6, palabra: 'Camaradería', definiciones : [], sinonimos: []},
                { id:7, palabra: 'Independencia', definiciones : [], sinonimos: []},
                { id:8, palabra: 'Equidad', definiciones : [], sinonimos: []},
                { id:9, palabra: 'obsequiar', definiciones : [], sinonimos: []},
                { id:10, palabra: 'Amor', definiciones : [], sinonimos: []},
            ],
        
            definiciones : [
                { id:1, definicion : "Sentimiento de afecto, atracción y cariño hacia otra persona.."},
                { id:2, definicion : "Estado de bienestar y satisfacción personal."},
                { id:3, definicion : "Logro de metas y objetivos deseados."},
                { id:4, definicion : "Condición de poder actuar y decidir sin restricciones externas."},
                { id:5, definicion : "Capacidad de generar ideas originales y novedosas."},
                { id:6, definicion : "Vínculo afectivo y de confianza entre personas."},
                { id:7, definicion : "Principio ético de dar a cada uno lo que le corresponde."},
                { id:8, definicion : "Estado de calma y ausencia de conflictos."},
            ]
        }

    )
    
    

    const [open, setOpen] = useState(false)

    const [definicion, setDefinicion] = useState({})

    const [definiciones, setDefiniciones] = useState([])

    const [sinonimos, setSinonimos] = useState([])

    const [cont, setCont] = useState(0)

    useEffect( () => {
        updateSinonimos()
      }, [cont] )
      

    

    const updateSinonimos = () => {
        const updatedDataSet = {
          ...dataSet,
          palabras: dataSet.palabras.map((palabra) => {
            const definiciones = palabra.definiciones;
            const sinonimosSet = new Set(); // Utilizamos un Set para evitar duplicados
      
            definiciones.forEach((definicionId) => {
              dataSet.palabras.forEach((otraPalabra) => {
                if (otraPalabra.id !== palabra.id) {
                  const otraDefiniciones = otraPalabra.definiciones;
                  if (otraDefiniciones.includes(definicionId)) {
                    sinonimosSet.add(otraPalabra.id); // Agregamos el sinónimo al Set
                  }
                }
              });
            });
      
            const sinonimos = Array.from(sinonimosSet); // Convertimos el Set en un Array
      
            return {
              ...palabra,
              sinonimos: sinonimos,
            };
          }),
        };
      
        setDataSet(updatedDataSet);
    };    


    const handleClickAdd = (idPalabra, idDefinicion) => {
        
        const updatedPalabras = dataSet.palabras.map((objeto) => {
          if (objeto.id === idPalabra) {
            return {
              ...objeto,
              definiciones: [...objeto.definiciones, idDefinicion],
            };
          }
          return objeto;
        });
        setDataSet((prevDataSet) => ({
          ...prevDataSet,
          palabras: updatedPalabras,
        }));
        setCont(Date.now())
        //console.log("OBJETO PAL =", updatedPalabras.find((objeto) => objeto.id === idPalabra));
        //console.log("OBJETO DEF =", dataSet.definiciones.find((objeto) => objeto.id === idDefinicion));

        
    };

    const handleClickRemove = (idPalabra, idDefinicion) => {
        const updatedPalabras = dataSet.palabras.map((objeto) => {
          if (objeto.id === idPalabra) {
            const definiciones = objeto.definiciones.filter(
              (defId) => defId !== idDefinicion
            );
            return {
              ...objeto,
              definiciones: definiciones,
            };
          }
          return objeto;
        });
      
        setDataSet((prevDataSet) => ({
          ...prevDataSet,
          palabras: updatedPalabras,
        }));
        setCont(Date.now());
      };



    const handleClickDefinicion = (idPalabra) => {
        const palabraObjeto = dataSet.palabras.find((palabra) => palabra.id === idPalabra);
        console.log("OBJETO DEFINICION  = ", palabraObjeto)

        setDefinicion(palabraObjeto)

        const definicionesArray = palabraObjeto.definiciones.map((idDefinicion) => {
            const definicionObjeto = dataSet.definiciones.find((definicion) => definicion.id === idDefinicion);
            return definicionObjeto ? definicionObjeto.definicion : '';
        });

        const sinonimosArray = palabraObjeto.sinonimos.map((idSinonimo) => {
            const sinonimoObjeto = dataSet.palabras.find((palabra) => palabra.id === idSinonimo);
            return sinonimoObjeto ? sinonimoObjeto.palabra : '';
        });
        
        console.log("definiciones array = ", definicionesArray)

        console.log("sinonimos array = ", sinonimosArray)
        setDefiniciones(definicionesArray)  
        setSinonimos(sinonimosArray)
        console.log("CLICK DEFINICION", palabraObjeto)
        setOpen(true)
    }


    const verificaRelacion = (definiciones, id) => {
        if (definiciones.includes(id)){
            return true
        }else {
            return false
        }
    }

    const handlePredeterminado = () => {
        setDataSet({
            palabras : [
                { id:1, palabra: 'Creatividad', definiciones : [5], sinonimos: []},
                { id:2, palabra: 'Amistad', definiciones : [6], sinonimos: []},
                { id:3, palabra: 'Innovación', definiciones : [5], sinonimos: []},
                { id:4, palabra: 'Felicidad', definiciones : [4], sinonimos: []},
                { id:5, palabra: 'Éxito', definiciones : [3], sinonimos: []},
                { id:6, palabra: 'Camaradería', definiciones : [6], sinonimos: []},
                { id:7, palabra: 'Independencia', definiciones : [4], sinonimos: []},
                { id:8, palabra: 'Equidad', definiciones : [7], sinonimos: []},
                { id:9, palabra: 'Amor', definiciones : [1], sinonimos: []},
            ],
        
            definiciones : [
                { id:1, definicion : "Sentimiento de afecto, atracción y cariño hacia otra persona.."},
                { id:2, definicion : "Estado de bienestar y satisfacción personal."},
                { id:3, definicion : "Logro de metas y objetivos deseados."},
                { id:4, definicion : "Condición de poder actuar y decidir sin restricciones externas."},
                { id:5, definicion : "Capacidad de generar ideas originales y novedosas."},
                { id:6, definicion : "Vínculo afectivo y de confianza entre personas."},
                { id:7, definicion : "Principio ético de dar a cada uno lo que le corresponde."},
                { id:8, definicion : "Estado de calma y ausencia de conflictos."},
            ]
        })
    }

    return (
        <>
      
        <div className="bg-white rounded-lg shadow-md p-4" >
            <div className="md:flex md:items-center md:justify-between mb-2 ">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Matriz de Definiciones
                        </h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        
                    <button onClick={()=>handlePredeterminado()} data-tooltip-id="my-tooltip" data-tooltip-content="Cargar Valores">
                        Predeterminado
                    </button>
                    </div>
            </div>

                
        </div>
            

            {/* TABLA AQUI */}
            
            <div className="bg-white rounded-lg shadow-md p-4 mt-2 " >
                <div className="mt-8 flow-root overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <table className="w-full text-left border-solid ">
                            <thead className="bg-white">
                                <tr>
                                    <th>Palabra / Def</th>
                                    {dataSet.definiciones.map((def) => (
                                            <>
                                            <th id={def.id} key={def.id} tool
                                                  scope="col"
                                                className={`relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 vertical-header ${styles['vertical-header']} `}
                                            >
                                                <div className={`${styles['vertical-text']}`}>{def.definicion}</div>
                                           
                                            </th>
                                             
                                           </>
                                    ))}
                                  
                                   
                                </tr>
                            </thead>
                            <tbody >
                                {dataSet.palabras.map((palabra) => (
                                    <tr key={palabra.id}>
                                        <td onClick={ () => handleClickDefinicion(palabra.id) } className={`relative py-4 pr-3 text-sm font-medium text-orange-900 ${styles['link-like']}`}>
                                            {palabra.palabra}
                                           
                                        </td >
                                        {dataSet.definiciones.map((def) => (
                                            <td   key={def.id} className="text-center"  >
                                                {(verificaRelacion(palabra.definiciones, def.id)) ? 
                                                    ( 
                                                        <button data-tooltip-id={`${palabra.id}-${def.id}`} data-tooltip-content={def.definicion} data-tooltip-delay-show="350" className="rounded-full bg-orange-600 p-1 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"  onClick={ () =>   handleClickRemove(palabra.id, def.id)}  
                                                        >
                                                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                    ) 
                                                    : 
                                                    (    
                                                        <button data-tooltip-id={`${palabra.id}-${def.id}`} data-tooltip-content={def.definicion} data-tooltip-delay-show="350" className="rounded-full bg-gray-600 p-1 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"  onClick={ () =>   handleClickAdd(palabra.id, def.id)}  
                                                        >
                                                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                    ) 
                                                }
                                                <Tooltip id={`${palabra.id}-${def.id}`} /> 
                                            </td>
                                        ))}
                                   
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
            {/* FIN TABLA */}

            {open &&  
                <ModalDefinicion open={open} setOpen= {setOpen} definicion={definicion} definiciones={definiciones} sinonimos={sinonimos} />
            }

        </>
        
    )
}

export default MatrizBetaHome