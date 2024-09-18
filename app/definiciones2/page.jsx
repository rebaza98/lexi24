'use client'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import React, { useState } from 'react'
import ModalChatGPTRelaciones from '@/components/ChatGPT/ModalChatGPTRelaciones';
import MatrizContruccion2 from '@/components/definiciones2/MatrizConstruccion2';
import IngresaPalabrasMatriz from '@/components/definiciones2/IngresaPalabrasMatriz';
import IngresaFraseMatriz from '@/components/definiciones2/IngresaFraseMatriz';




const Home = () => {

    const [dataSet, setDataSet] = useState(
      {
        palabras: [],
        definiciones: [],
      }
    )




  
    return (
      <div>
        <div className='w-1/3  mb-20 ' >

          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Ingresar Palabra
          </label>
          <IngresaPalabrasMatriz dataSet={dataSet} setDataSet={setDataSet} />

        </div>

        <div className='w-1/3  mb-20 ' >

          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Ingresar Lexicon
          </label>
          <IngresaFraseMatriz dataSet={dataSet} setDataSet={setDataSet}  />

        </div>

        
        <div>
            <MatrizContruccion2 dataSet={dataSet} setDataSet={setDataSet} />
        </div>

        
       
      </div>
    );
}

export default Home