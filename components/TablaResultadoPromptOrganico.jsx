
const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
  }

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
  ]
  
  export default function TablaResultadoPromptOrganico({textoProcesado, fraseProcesada, fraseNueva}) {
    console.log("TEXTO PROCESADO EN TABLA COMPONENTE = ", textoProcesado)
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Lexicon</h1>
            <p className="mt-2 text-2xl  text-gray-700">
                <span className="italic" >
                {`"${fraseProcesada}" `}
                </span>
                {fraseNueva && <span className='rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20' >
                {"nueva"}
                </span>}
                
            </p>
          </div>
          
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                      PALABRA
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Relaciones
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Orden
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Censura
                    </th>
                    
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {textoProcesado.map((palabra, index) => (
                    
                    <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            
                            <div className="flex items-start gap-x-3">
                                <div className="text-sm font-medium leading-6 text-gray-900">{palabra.palabra}</div>
                                {palabra.nuevo && 
                                <div
                                    className='rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20'
                                >
                                    {"nueva"}
                                </div>
                                }
                                
                            </div>
                        </td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{palabra.nroRelaciones}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{palabra.orden}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{palabra.censura}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  