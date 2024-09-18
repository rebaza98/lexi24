import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, AcademicCapIcon, UsersIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline'

export default function ModalChatGPTRelaciones({open, setOpen}) {
  // const [open, setOpen] = useState(true)

  const [palabra, setPalabra] = useState('')
  const [promptRespuesta, setPromptRespuesta] = useState('')
  const [generating, setGenerating] = useState(false)


  useEffect(() => {
    const storedPromptRespuesta = JSON.parse(localStorage.getItem('storedPromptRespuesta'));
    if(storedPromptRespuesta){
      setPromptRespuesta(storedPromptRespuesta)
    }
  }, [])

  const removeStoredPrompt = () => {
    setPromptRespuesta('')
    localStorage.removeItem('storedPromptRespuesta');

  }

  const cancelButtonRef = useRef(null)

  const fetchData = async () => {
    setGenerating(true)
    const response = await fetch('/api/chatgpt', {
      method: 'POST',
      body: JSON.stringify({ palabra: palabra }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("RESPONSE DE CHAT = ", response)
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setPromptRespuesta(data.choices[0].message.content)
      setGenerating(false)
      localStorage.setItem('storedPromptRespuesta', JSON.stringify(data.choices[0].message.content));
      // Puedes trabajar con los datos JSON aquí
    } else {
      console.error('Error en la solicitud');
      setPromptRespuesta('Error en la solicitud')
      setGenerating(false)
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {}}>
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
                    <button onClick={() => removeStoredPrompt()} >
                      <AcademicCapIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </button>
                    
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      <div>
                        
                        <div className="mt-2 flex rounded-md shadow-sm">
                          <div className="relative flex flex-grow items-stretch focus-within:z-10">
                            
                            <input
                              type="text"
                              name="palabraInput"
                              id="palabraInput"
                              className="block w-full rounded-none lowercase rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={(e)=>{ setPalabra(e.target.value.toLowerCase())}}
                              autoComplete='off'
                            />
                          </div>
                          <button
                            type="button"
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-10 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={ () => fetchData()}
                          >
                            <BarsArrowUpIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            {generating ? 'Generando...' : 'Generar'}
                          </button>
                        </div>
                      </div>
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="text-sm text-left text-gray-500">
                        {promptRespuesta.split('\n').map((line, index) => (
                          <div key={index}>
                            {line}
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:col-start-2"
                    onClick={() => setOpen(false)}
                  >
                    Cerrar
                  </button>
                  </div>
                  
                  
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
