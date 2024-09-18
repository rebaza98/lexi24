import { Fragment, useState } from 'react'
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { CheckIcon, NewspaperIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function ModalConstruccion({open, setOpen, definicion, definiciones, sinonimos, inferencias}) {
  //const [open, setOpen] = useState(true)

  console.log("SE ABRE ESTE MODAL", definicion)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={(setOpen)}>
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
                    <NewspaperIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {definicion.palabra}.
                    </Dialog.Title>
                    <div className="mt-2">
                      <p><strong>Definicion: </strong></p> 
                      
                     
                    {definiciones.map((def, i) => (
                          <span key={i} >{` ${def.toLowerCase()} `}</span>
                        
                      ))}

                      
                    </div>
                    <div className="border-b border-gray-900/10 pb-12"></div>
                    {inferencias.length || sinonimos.length ? 
                    (
                      <>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-indigo-100 px-4 py-2 text-left text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
                              <span>Por Ontologia:</span>
                              <ChevronUpIcon
                                className={`${open ? 'rotate-180 transform' : ''
                                  } h-5 w-5 text-indigo-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                              {inferencias.map((inferencia, i) => (
                                <div key={i}>
                                  <h3><strong>{`<`}{inferencia.palabra}{`><`}</strong>
                                    {inferencia.definiciones.map((definicion, j) => (
                                      <span key={j} >{` `}{definicion}{` `}</span>
                                    ))}
                                    <strong>{`> `}</strong>
                                  </h3>
                                </div>
                              ))}
                              <br></br>
                                  {sinonimos.length ? (
                                  <Disclosure>
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-green-100 px-4 py-2 text-left text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
                                          <span>Remisiones:</span>
                                          <ChevronUpIcon
                                            className={`${open ? 'rotate-180 transform' : ''
                                              } h-5 w-5 text-green-500`}
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                          {sinonimos.map((palabra, j) => (
                                            <div key={j}>
                                              véase.<strong>{`<`}{palabra}{`>`}</strong>      
                                                
                                            </div>
                                            
                                          ))}

                                        </Disclosure.Panel>

                                      </>
                                    )}
                                  </Disclosure>
                                  ): ('')
                                  }

                                </Disclosure.Panel>
                            
                          </>
                        )}
                      </Disclosure>
                      
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 "
                    onClick={() => setOpen(false)}
                  >
                    Cerrar
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