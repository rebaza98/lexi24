import neo4j from "neo4j-driver"

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env


const driver = neo4j.driver(
    "neo4j+s://dcfaa802.databases.neo4j.io",//GEEKY
    neo4j.auth.basic(
        "neo4j",
        "SNRDa6dA-g5_CokxC18vPvmpN-b7yk7kJrbMnLyvCKg"
    )
  )

const driver2 = neo4j.driver(
    "neo4j+s://3108321e.databases.neo4j.io", //GEEKY
    //"neo4j+s://5cb96de3.databases.neo4j.io", //CARE
    neo4j.auth.basic(
        "neo4j",
        "PCQNwl1yEj9qgmKZmn-kmDvAqzIshbN_ch4byoDmxV8" //GEEKY
      //  "N3rN2o4C0eICh4gmx-Zcpni0bbmFM-5FLa2HgaiSU6c" // CARE
    )
  )


  export async function read(selectedDB, cypher, params = {}) {


    let session = undefined

    if (selectedDB == 1){
        session = driver.session()    
    }else{
        session = driver.session()    
    }


    // 1. Open a session
    //const session = driver.session()
  
    try {
      // 2. Execute a Cypher Statement
      const res = await session.executeRead(tx => tx.run(cypher, params))
  
      // 3. Process the Results
      const values = res.records.map(record => record.toObject())
  
      return values
    }
    finally {
      // 4. Close the session 
      await session.close()
    }
  }
  
  export async function write(cypher, params = {}) {
    // 1. Open a session
    const session = driver.session()
  
    try {
      // 2. Execute a Cypher Statement
      const res = await session.executeWrite(tx => tx.run(cypher, params))
  
      // 3. Process the Results
      const values = res.records.map(record => record.toObject())
      
  
      return values
    }
    finally {
      // 4. Close the session 
      await session.close()
    }
  }