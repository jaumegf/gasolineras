export default async function handler(req, res) {
  const URL = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

  const CP = ["12001","12002","12003","12004","12005","12006","12100"];

  const forceRefresh = req.query.refresh === "true";

  // 🟢 CDN cache (solo si no forzamos refresh)
  if (!forceRefresh) {
    res.setHeader(
      "Cache-Control",
      "s-maxage=86400, stale-while-revalidate"
    );
  }

  // 📦 init cache memoria
  if (!global.cache) {
    global.cache = {};
  }

  const hoy = new Date().toISOString().slice(0,10);

  // 🟢 usar cache en memoria
  if (!forceRefresh && global.cache[hoy]) {
    console.log("MEMORY CACHE");
    return res.status(200).json(global.cache[hoy]);
  }

  console.log("FETCH MINISTERIO");

  const response = await fetch(URL);
  const data = await response.json();

  // 🔥 filtrar solo Castellón
  const filtrado = data.ListaEESSPrecio.filter(e =>
    CP.includes(e["C.P."])
  );

  const resultado = {
    fecha: new Date().toISOString(),
    estaciones: filtrado
  };

  // guardar en memoria
  global.cache[hoy] = resultado;

  return res.status(200).json(resultado);
}