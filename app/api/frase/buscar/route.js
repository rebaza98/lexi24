import { retornaListaMeta_Frase } from "@/lib/cypherQuery";
import { read } from "@/lib/neo4j";


export const GET = async (req, context) => {

  try {
    //await connectToDB();

    if (req.method === "GET") {
      const queryParams = new URLSearchParams(req.url.split('?')[1]);
      const q = queryParams.get('q');

      if (q) {
        const listaPalabras = await read(2, retornaListaMeta_Frase(q), {});
        
        return new Response(JSON.stringify(listaPalabras), { status: 200 });
        
      } else {
        console.log("Missing query parameter 'q'");
        return new Response("ERROR 400: Missing query parameter 'q'", {
          status: 400
        });
      }
    }

    console.log("Method not allowed");
    return new Response("ERROR 405: Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Error fetching personas:", error);
    return new Response("ERROR 500: Failed to fetch personas", { status: 500 });
  }
};


