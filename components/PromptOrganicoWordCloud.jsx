import React from 'react'
import { TagCloud } from 'react-tagcloud'

const PromptOrganicoWordCloud = ({definiciones}) => {

    console.log("DEFUBUCUIB= ", definiciones)
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
        console.log("TAG = CENSURA =)", tag.censura)
        const textColor = colorScale[tag.censura]
      
        return (
          <span key={tag.value} style={{ color:textColor, fontSize:size, cursor:"pointer" }} >
            {tag.value}{" "} 
          </span>
        )
      }
  return (
      <>
          <h1 className="mt-4 tracking-tight text-center font-bold sm:text-3xl">WordCloud</h1>

          <div className='flex justify-center' >
              <div className='w-1/4 text-center ' >
                  <TagCloud
                      renderer={customRenderer}
                      minSize={20}
                      maxSize={40}
                      tags={definiciones}
                      shuffle={false}
                      // onClick={tag => alert(`'${tag.value}' was selected!`)}
                      onClick={(tag) => {console.log(tag)}}

                  />
              </div>
          </div>
      </>
    
  )
}

export default PromptOrganicoWordCloud