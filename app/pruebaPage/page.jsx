'use client'

import { name } from "@ontologies/schema";
import rdf from "@ontologies/core"
import "./ontologiesInit"; // Importa el archivo de inicialización
import { TagCloud } from 'react-tagcloud'

import { read } from "@/lib/neo4j";


const wordList = [
  { value: 'gato', count: 25 },
  { value: 'perro', count: 30 },
  { value: 'casa', count: 20 },
  { value: 'sol', count: 18 },
  { value: 'jardín', count: 15 },
  { value: 'comida', count: 22 },
  { value: 'familia', count: 28 },
  { value: 'amigos', count: 24 },
  { value: 'viaje', count: 19 },
  { value: 'trabajo', count: 17 },
  { value: 'música', count: 21 },
  { value: 'libro', count: 16 },
  { value: 'ciudad', count: 23 },
  { value: 'naturaleza', count: 14 },
  { value: 'arte', count: 27 },
  { value: 'deporte', count: 26 },
  { value: 'educación', count: 120 },
  { value: 'tecnología', count: 18 },
  { value: 'salud', count: 20 },
  { value: 'dinero', count: 15 },
  // Agrega más palabras y frecuencias según tu necesidad
];

const defaultGraphDB = 1





// custom renderer is function which has tag, computed font size and
// color as arguments, and returns react component which represents tag
const customRenderer = (tag, size, color) => (
  <>
  <span
    key={tag.value}
    style={{
      animationDelay: `${Math.random() * 2}s`,
      fontSize: `${size / 2}em`,
      margin: '3px',
      padding: '3px',
      display: 'inline-block',
      color: 'white',
    }}
  >
    {tag.value}
  </span>
  </>
  
)

import { useEffect } from "react"


// export async function getStaticProps() {
//   const res = await read(`
//     MATCH (g:Genre)
//     WHERE g.name <> '(no genres listed)'

//     CALL {
//     WITH g
//     MATCH (g)<-[:IN_GENRE]-(m:Movie)
//     WHERE m.imdbRating IS NOT NULL AND m.poster IS NOT NULL
//     RETURN m.poster AS poster
//     ORDER BY m.imdbRating DESC LIMIT 1
//     }

//     RETURN g {
//       .*,
//       movies: toString(size((g)<-[:IN_GENRE]-(:Movie))),
//       poster: poster
//     } AS genre
//     ORDER BY g.name ASC
//   `)
  
//   console.log("RES = ", res)
//   const genres = res.map(row => row.genre)

//   return {
//     props: {
//       genres,
//     }
//   }
// }


export default function Example() {

  async function getDataTest(){
    const res = await read(defaultGraphDB, `
    MATCH (cust:Customer)-[:PURCHASED]->(:Order)-[o:ORDERS]->(p:Product),
    (p)-[:PART_OF]->(c:Category {categoryName:'Produce'})
      RETURN cust.contactName as CustomerName,
     sum(o.quantity) AS TotalProductsPurchased
      `)
    
    console.log("RES = ", res)
    const genres = res.map(row => row.genre)

    return {
      props: {
        genres,
      }
    } 
  }


  async function getDataNodes(){
    const res = await read(2 ,
      `MATCH (n:Product) RETURN n LIMIT 25;`
    )

    console.log("RES2 = ", res)
    //const data = await res.json()
    //console.log("DATA = ", data)
    // const genres = res.map(row => row.genre)

    // return {
    //   props: {
    //     genres,
    //   }
    // } 
  }

  useEffect(() => {
      console.log("OK!")
      console.log(`Schema URL: ${name.value}`);
      //getDataTest()
      getDataNodes()
      
  }, []);


  

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-orange-900 sm:text-5xl">TESITNG OWL LIBRARY</h1>
          <div className="w-1/12  mt-10 flex items-center justify-center gap-x-6">
          {/* <TagCloud
            minSize={12}
            maxSize={35}
            tags={wordList}
            onClick={tag => alert(`'${tag.value}' was selected!`)}
            
          /> */}

          </div>
        </div>
      </main>
    </>
  )
}