import React, { useMemo, useRef, useState } from 'react'
import { createAutocomplete } from '@algolia/autocomplete-core'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { PhotoIcon} from '@heroicons/react/24/solid'

const minLetras = 0

const AutocompleteItem = ({ p, setAutoCompleteState, dataSet, setDataSet }) => {
  

  const isFraseUsada = dataSet.definiciones.some((elegida) => elegida.definicion ===  p.properties.name);

  const handleItemClick = () => {
    if (!isFraseUsada) {
      setAutoCompleteState((prevState) => ({ ...prevState, isOpen: false }));
      setDataSet({
        ...dataSet,
        definiciones: [
          ...dataSet.definiciones,
          {
            id: dataSet.definiciones.length + 1,
            definicion: p.properties.name,
          },
        ],
      });
      //setOpen(false);
      // Aquí puedes realizar otras acciones relacionadas con el clic en la sugerencia
    }
  };


  return (
    <li onClick={isFraseUsada ? undefined : handleItemClick} className={isFraseUsada ? 'cursor-not-allowed' : ''} >
    {/* <li onClick={isCategoriaUsed ? undefined : handleItemClick} className={isCategoriaUsed ? 'cursor-not-allowed' : ''}> */}
      <div className='hover:bg-gray-200 flex gap-4 p-4'>
        <div className='w-4/5 flex justify-between ' >
            
                <div>
                    <h3 className='text-sm font-semibold'>{p.properties.name} {isFraseUsada && <span className="inline-flex flex-shrink-0 items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                  Usado
                </span>}</h3>
                </div>
            
        </div>
      </div>
    </li>
  );
};


export default function IngresaFraseMatriz(props) {

    const [autoCompleteState, setAutoCompleteState] = useState({
        collections: [],
        isOpen : false

    })
    const [criterio, setCriterio] = useState('')


    const autoComplete = useMemo(() =>   createAutocomplete({
        placeholder: "Ingresa una Frase",
        onStateChange: ({ state }) =>  setAutoCompleteState(state),
        getSources: () => [{
            sourceId:'in_palabra-next-api',
            getItems: async({ query }) => {
              if (!!query && query.length >= minLetras) {
                return toast.promise(
                  fetch(`/api/frase/buscar?q=${query}`)
                    //.then((res) => res.json()),
                    .then((res) => {
                        return res.json()
                        
                        
                    })
                    .then((data) => {
                        console.log("Array de datos = ", data);
                        // Aquí puedes trabajar con el Array de datos
                        return data
                    }),
                  {
                    pending: "Cargando datos...",
                  }
                );
              }
              return []
                
                
            }
            
        }],
        ...props
    }), [props])


   
    const inputRef = useRef(null)
    const panelRef = useRef(null)


    

    const inputProps = autoComplete.getInputProps({
        inputElement: inputRef.current
        
    })




    return (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name="busqueda_frase"
            id="id_busqueda_frase"
            className="block w-full rounded-md border-0 py-1.5 lowercase text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={criterio}
            onChange={e => setCriterio(e.target.value.toLocaleLowerCase)}
            {...inputProps}
          />
    
          {autoCompleteState.isOpen && (
            <div
              className="absolute left-0 mt-2 border border-gray-100 z-10 bg-white rounded-lg shadow-lg"
              style={{
                width: inputRef.current.offsetWidth
              }}
              ref={panelRef}
              {...autoComplete.getPanelProps()}
            >
              {autoCompleteState.collections.map((collection, index) => {
                const { items } = collection;
                return (
                  <section key={`section-${index}`}>
                    {items.length > 0 && (
                      <ul {...autoComplete.getListProps()}>
                        {items.map((item) => {
                            return <AutocompleteItem key={item.p.elementId} setAutoCompleteState={setAutoCompleteState} dataSet={props.dataSet} setDataSet={props.setDataSet}  {...item} />
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      );
    }
