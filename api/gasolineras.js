export default async function handler(req, res) {
  const URL = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

  // cache en memoria (vive mientras la función esté caliente)
  if (!global.cache) {
    global.cache = {};
  }

  const hoy = new Date().toISOString().slice(0,10); // YYYY-MM-DD

  // si ya hay cache de hoy → devolver
  if (global.cache[hoy]) {
    return res.status(200).json(global.cache[hoy]);
  }

  // fetch API
  const response = await fetch(URL);
  const data = await response.json();

  // filtrar Castellón
  const CP = ["12001","12002","12003","12004","12005","12006","12100"];

  const filtrado = data.ListaEESSPrecio.filter(e =>
    CP.includes(e["C.P."])
  );

  const resultado = {
    fecha: new Date().toISOString(),
    estaciones: filtrado
  };

  // guardar en cache
  global.cache[hoy] = resultado;

  return res.status(200).json(resultado);
}