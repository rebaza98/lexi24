'use client'

//import CModalProducto from "@/components/inventario/producto/CModalProducto"
import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import styles from "./styles.module.css"
import { PhotoIcon, UserCircleIcon, PlusIcon, MinusIcon} from '@heroicons/react/24/solid'
import ModalDefinicion from "@/components/ModalDefinicion"
import ModalConstruccion from "@/components/ModalConstruccion"

import { Tooltip } from "react-tooltip"
import { write } from "@/lib/neo4j"
import { crearNodo, vincularDefinicionPalabra, vincularMetaFraseDefinicion } from "@/lib/cypherQuery"
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'


// const pages = [
//     { name: 'Inventario', href: '#', current: false },
//     { name: 'Productos', href: '/inventario/productos', current: true },
//   ]

const nodoPalabra = "palabra"
const nodoMetaFrase = "meta_frase"
const nodoDefinicion = "definicion"

const MatrizContruccion2 = ({dataSet, setDataSet}) => {

    // const [dataSet, setDataSet] = useState(
    //     {
    //         palabras : [
    //             { id:1, palabra: 'dar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:2, palabra: 'entregar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:3, palabra: 'conceder', definiciones : [], sinonimos: [], inferencias: []}, 
    //             // { id:4, palabra: 'otorgar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:5, palabra: 'suministrar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:6, palabra: 'regalar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:7, palabra: 'donar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:8, palabra: 'proporcionar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:9, palabra: 'obsequiar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:10, palabra: 'adjudicar', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:11, palabra: 'conferir', definiciones : [], sinonimos: [], inferencias: []},
    //             // { id:12, palabra: 'prestar', definiciones : [], sinonimos: [], inferencias: []},
    //         ],
            
    //         definiciones : [
    //             { id:1, definicion : "hacer que una cosa pase a otra persona"},
    //             // { id:2, definicion : "transfiriendo responsabilidad"},
    //             // { id:3, definicion : "por la autoridad que se tiene"},
    //             // { id:4, definicion : "por requerimiento"},
    //             // { id:5, definicion : "por mérito o recompensa"},
    //             // { id:6, definicion : "por Necesidad"},
    //             // { id:7, definicion : "como muestra de afecto"},
    //             // { id:8, definicion : "voluntariamente"},
    //             // { id:9, definicion : "algo de valor"},
    //             // { id:10, definicion : "sin esperar recompensa o retribución"},
    //             // { id:11, definicion : "algo que no se puede obtener por otra vía"},
    //             // { id:12, definicion : "para un fin determinado"},
    //             // { id:13, definicion : "por derecho o merecimiento"},
    //             // { id:14, definicion : "temporalmente"},
    //             // { id:15, definicion : "recurso para funcionamiento"},
    //             // { id:16, definicion : "con malas"},
    //         ]
    //     }

    // )
    
    const router = useRouter()
    

    const [open, setOpen] = useState(false)

    const [definicion, setDefinicion] = useState({})

    const [definiciones, setDefiniciones] = useState([])

    const [sinonimos, setSinonimos] = useState([])

    const [inferencias, setInferencias] = useState([])

    const [cont, setCont] = useState(0)

    useEffect( () => {
        //updateSinonimos()
        
        generarInferencias()
        ordenarDefiniciones()
        console.log("CAMBIO EN CONT")
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

    const ordenarDefiniciones = () => {
        console.log("Ordenando definiciones en forma ascendente...");
      
        const updatedDataSet = {
          ...dataSet,
          palabras: dataSet.palabras.map((palabra) => {
            console.log(`Palabra: ${palabra.palabra}`);
      
            const definiciones = palabra.definiciones.slice().sort((a, b) => a - b); // Ordenar las definiciones ascendente
      
            console.log(`Definiciones ordenadas: ${definiciones}`);
      
            return {
              ...palabra,
              definiciones: definiciones,
            };
          }),
        };
      
        console.log("DataSet actualizado:", updatedDataSet);
      
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

        setDefinicion(palabraObjeto)

        const definicionesArray = palabraObjeto.definiciones.map((idDefinicion) => {
            const definicionObjeto = dataSet.definiciones.find((definicion) => definicion.id === idDefinicion);
            return definicionObjeto ? definicionObjeto.definicion : '';
        });

        const sinonimosArray = palabraObjeto.sinonimos.map((idSinonimo) => {
            const sinonimoObjeto = dataSet.palabras.find((palabra) => palabra.id === idSinonimo);
            return sinonimoObjeto ? sinonimoObjeto.palabra : '';
        });
        const arrayInferencias = Object.entries(palabraObjeto.inferencias).map(([id, definicionesIds]) => {
            const palabraInferencia = dataSet.palabras.find((palabra) => palabra.id === parseInt(id));
            //const palabraInferencia = dataSet.palabras.find((palabra) => palabra.id === (id));
            const definicionesInferencia = definicionesIds.map((idDefinicion) => {
              const definicionObjeto = dataSet.definiciones.find((definicion) => definicion.id === idDefinicion);
              return definicionObjeto ? definicionObjeto.definicion : '';
            });
            return {
              palabra: palabraInferencia.palabra,
              definiciones: definicionesInferencia,
            };
        });

        
        

        setDefiniciones(definicionesArray)  
        setSinonimos(sinonimosArray)
        setInferencias(arrayInferencias)

        console.log("***************")
        console.log(definicionesArray)
        console.log(sinonimosArray)
        console.log(arrayInferencias)
        setOpen(true)
    }


    const verificaRelacion = (definiciones, id) => {
        if (definiciones.includes(id)){
            return true
        }else {
            return false
        }
    }


    const generarInferencias = () => {
      const palabras = dataSet?.palabras;
    
      palabras?.forEach((palabra) => {
        palabra.inferencias = []; // Establecer inferencias como un array vacío
        palabra.sinonimos = []; // Establecer sinonimos como un array vacío
    
        const definicionesPalabra = palabra.definiciones;
        const inferencias = {};
    
        console.log(`1-Palabra actual: ${palabra.palabra}`);
        console.log(`2-Definiciones palabra actual: ${definicionesPalabra}`);
    
        palabras.forEach((otraPalabra) => {
          if (otraPalabra.id !== palabra.id) {
            console.log(`3-Otra palabra: ${otraPalabra.palabra}`);
    
            const definicionesOtraPalabra = otraPalabra.definiciones;
            const definicionesComunes = definicionesPalabra.filter((def) =>
              definicionesOtraPalabra.includes(def)
            );
    
            console.log(`4-Definiciones comunes: ${definicionesComunes}`);
            console.log(`5-Definiciones otra palabra: ${definicionesOtraPalabra}`);
    
            if (
              definicionesComunes.length === definicionesOtraPalabra.length &&
              definicionesOtraPalabra.length < definicionesPalabra.length &&
              definicionesPalabra.length > 0 &&
              definicionesOtraPalabra.length > 0
            ) {
              console.log(`6-Entra en el bloque if`);
    
              const definicionesFaltantes = definicionesPalabra.filter(
                (def) => !definicionesOtraPalabra.includes(def)
              );
    
              console.log(`7-Definiciones faltantes: ${definicionesFaltantes}`);
    
              const definicionesCorrespondientes = definicionesFaltantes.filter(
                (def) => !definicionesComunes.some((comun) => def < comun)
              );
    
              console.log(`8-Definiciones correspondientes: ${definicionesCorrespondientes}`);
    
              if (
                definicionesCorrespondientes.length > 0 &&
                definicionesCorrespondientes.length === definicionesFaltantes.length 
                ) {
                inferencias[otraPalabra.id] = definicionesCorrespondientes;
              }
    
             
            }
            if (
              definicionesComunes.length === definicionesPalabra.length &&
              definicionesPalabra.length !== 0 &&
              definicionesComunes.length === definicionesOtraPalabra.length 
            ) {
              console.log(`9-Agregando sinónimo: ${otraPalabra.id}`);
              palabra.sinonimos.push(otraPalabra.id);
            }
          }
        });
    
        if (Object.keys(inferencias).length > 0) {
          palabra.inferencias = inferencias;
        }
    
        console.log(`10-Inferencias de la palabra actual: ${JSON.stringify(inferencias)}`);
        console.log(`11-Sinónimos de la palabra actual: ${JSON.stringify(palabra.sinonimos)}`);
      });
    
      setDataSet((prevDataSet) => ({
        ...prevDataSet,
        palabras: palabras,
      }));
    };
    
    
    
      
      const handlePredeterminado = () => {
        console.log("PREDETERMINADO")
        const datasetPredeterminaro = {
            palabras : [
                { id:1, palabra: 'dar', definiciones : [1], sinonimos: [], inferencias: []},
                { id:2, palabra: 'entregar', definiciones : [1,2], sinonimos: [], inferencias: []},
                { id:3, palabra: 'conceder', definiciones : [1,3,4], sinonimos: [], inferencias: []}, 
                { id:4, palabra: 'otorgar', definiciones : [1,3,4,5], sinonimos: [], inferencias: []},
                { id:5, palabra: 'suministrar', definiciones : [1,6,12,15], sinonimos: [], inferencias: []},
                { id:6, palabra: 'regalar', definiciones : [1,7,8], sinonimos: [], inferencias: []},
                { id:7, palabra: 'donar', definiciones : [16,8,9,10], sinonimos: [], inferencias: []},
                { id:8, palabra: 'proporcionar', definiciones : [1,6,11,12], sinonimos: [], inferencias: []},
                { id:9, palabra: 'obsequiar', definiciones : [1,8,12], sinonimos: [], inferencias: []},
                { id:10, palabra: 'adjudicar', definiciones : [1,3,4,13], sinonimos: [], inferencias: []},
                { id:11, palabra: 'conferir', definiciones : [1,3,8], sinonimos: [], inferencias: []},
                { id:12, palabra: 'prestar', definiciones : [1,4,14], sinonimos: [], inferencias: []},
            ],
            
            definiciones : [
                { id:1, definicion : "hacer que una cosa pase a otra persona"},
                { id:2, definicion : "transfiriendo responsabilidad"},
                { id:3, definicion : "por la autoridad que se tiene"},
                { id:4, definicion : "por requerimiento"},
                { id:5, definicion : "por mérito o recompensa"},
                { id:6, definicion : "por Necesidad"},
                { id:7, definicion : "como muestra de afecto"},
                { id:8, definicion : "voluntariamente"},
                { id:9, definicion : "algo de valor"},
                { id:10, definicion : "sin esperar recompensa o retribución"},
                { id:12, definicion : "algo que no se puede obtener por otra vía"},
                { id:13, definicion : "para un fin determinado"},
                { id:14, definicion : "por derecho o merecimiento"},
                { id:15, definicion : "temporalmente"},
                { id:16, definicion : "recurso para funcionamiento"},
                { id:17, definicion : "con malas"},
            ]
        }
      setDataSet(datasetPredeterminaro)

      }


    // const handleGuardar = async () => {
    //   console.log("GUARDAR")
    //   //const toastId = toast.loading('Guardando ...', { autoClose: false });
    //   let flagDefNueva = false
    //   let defConCat = ""
    //   await Promise.all(
    //     dataSet.palabras.map(async(primePalabra) => {

    //       const palabraObjeto = dataSet.palabras.find((palabra) => palabra.id === primePalabra.id);
    //       console.log("TRABAJA CON PALABRA OBJETO = ", palabraObjeto)


    //       const definicionesArray = palabraObjeto.definiciones.map((idDefinicion) => {
    //         const definicionObjeto = dataSet.definiciones.find((definicion) => definicion.id === idDefinicion);
    //         return definicionObjeto ? definicionObjeto.definicion : '';
    //       });
    //       console.log("DEFINICIONES ARRAY", definicionesArray)
    //       //CREAR NODO DEFINICION
    //       flagDefNueva = false
    //       defConCat = ""

    //       definicionesArray.map((def, index) => {
    //         if (definicionesArray.length == (index + 1)){
    //           defConCat += def
    //         }else{
    //           defConCat += def + " "
    //         }
            
    //       })
    //       //PASO 1 CREAR NODO DEFINICION
    //       console.log("CREA NODO DEFINICION = ", nodoDefinicion, defConCat)
    //       flagDefNueva = await write(crearNodo(nodoDefinicion), {valor : defConCat})
    //       let orden = 0
    //       //PASO 2 VINCULAR FRASES A DEFINICION
    //       await Promise.all(
    //         definicionesArray.map(async(def, index) => {
    //           console.log("DEF DE DEF ARRAY = ", def)
    //           orden = index + 1
    //           console.log("ORDEN = ", orden)
    //           console.log("VINCULA = META DEF ORDEN ", defConCat, def, orden)
    //             await write(vincularMetaFraseDefinicion(defConCat, def, orden), {})
    //         })
    //       )
    //       console.log("VINCULA = DEF PALABRA ", defConCat, palabraObjeto.palabra)

    //       //PASO 3 VINCULAR PALABRA A DEFINICION
    //       await write(vincularDefinicionPalabra(defConCat, palabraObjeto.palabra), {})

    //       console.log("DEFINCICION = ", palabraObjeto)
    //       console.log("***************")
    //       console.log(definicionesArray)
    //       // console.log(sinonimosArray)
    //       // console.log(arrayInferencias)
    //     })
    //   )

          
        
    //   //toast.update(toastId, { type: 'success', render: 'Producto Grabado con exito...', isLoading: false, autoClose: true });
    //   //router.push(`/polisemia/${dataSet.palabras[0].palabra}`)

        
    //   }


    const handleGuardar = async () => {
      console.log("GUARDAR");
      const toastId = toast.loading('Guardando ...', { autoClose: false });
      let flagDefNueva = false;
      let defConCat = "";
    
      for (const primePalabra of dataSet.palabras) {
        const palabraObjeto = dataSet.palabras.find((palabra) => palabra.id === primePalabra.id);
        console.log("TRABAJA CON PALABRA OBJETO = ", palabraObjeto);
    
        const definicionesArray = palabraObjeto.definiciones.map((idDefinicion) => {
          const definicionObjeto = dataSet.definiciones.find((definicion) => definicion.id === idDefinicion);
          return definicionObjeto ? definicionObjeto.definicion : '';
        });
        console.log("DEFINICIONES ARRAY", definicionesArray);
    
        // CREAR NODO DEFINICION
        flagDefNueva = false;
        defConCat = "";
    
        definicionesArray.map((def, index) => {
          if (definicionesArray.length == index + 1) {
            defConCat += def;
          } else {
            defConCat += def + " ";
          }
        });
        // PASO 1 CREAR NODO DEFINICION
        console.log("CREA NODO DEFINICION = ", nodoDefinicion, defConCat);
        flagDefNueva = await write(crearNodo(nodoDefinicion), { valor: defConCat });
        let orden = 0;
        
        // PASO 2 VINCULAR FRASES A DEFINICION
        for (const [index, def] of definicionesArray.entries()) {
          console.log("DEF DE DEF ARRAY = ", def);
          orden = index + 1;
          console.log("ORDEN = ", orden);
          console.log("VINCULA = META DEF ORDEN ", defConCat, def, orden);
          await write(vincularMetaFraseDefinicion(defConCat, def, orden), {});
        }
    
        console.log("VINCULA = DEF PALABRA ", defConCat, palabraObjeto.palabra);
    
        // PASO 3 VINCULAR PALABRA A DEFINICION
        await write(vincularDefinicionPalabra(defConCat, palabraObjeto.palabra), {});
    
        console.log("DEFINCICION = ", palabraObjeto);
        console.log("***************");
        console.log(definicionesArray);
        // console.log(sinonimosArray)
        // console.log(arrayInferencias)
      }
    
      toast.update(toastId, { type: 'success', render: 'Guardado con exito...', isLoading: false, autoClose: true });
      router.push(`/polisemia/${dataSet.palabras[0].palabra}`);
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
                        <Tooltip id="my-tooltip" />
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
                                    <th>Palabra / Lexicon</th>
                                    {dataSet?.definiciones.map((def) => (
                                            <>
                                            <th id={def.id} key={def.id} 
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
                                {dataSet?.palabras.map((palabra) => (
                                    <tr key={palabra.id}>
                                        <td onClick={ () => handleClickDefinicion(palabra.id) } className={`relative py-4 pr-3 text-sm font-medium text-orange-900 ${styles['link-like']}`}>
                                            {palabra.palabra}
                                           
                                        </td >
                                        {dataSet?.definiciones.map((def) => (
                                            <td  key={def.id} className="text-center"  >
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
                <ModalConstruccion open={open} setOpen= {setOpen} definicion={definicion} definiciones={definiciones} sinonimos={sinonimos} inferencias={inferencias} />
            }
           <div className='flex justify-center mt-2' >
        <button
          type="button"
          onClick={handleGuardar}
          className="rounded-full bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Guardar
        </button>
      </div>

        </>
        
    )
}

export default MatrizContruccion2