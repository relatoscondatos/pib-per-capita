import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3"; 
import _ from "npm:lodash";

/**
* Processes data with the given options.
* 
* @param {Object} options - The options for processing data.
* @param {number} [options.dataCambioAnual=[]] - special array with absolute & relative values.
* @param {boolean} [options.añoReferencia=2024] - reference year.
* @param {string} [options.width=640] - Plot width.
*/
export function distribucionCifras({dataCambioAnual=[], añoReferencia=2024, width=640} = {}) {

 const maxValue = _.chain(dataCambioAnual)
   .map((d) => d.personas)
   .max()
   .value();
 const dataAñoReferencia = _.chain(dataCambioAnual)
   .find((d) => d.año == añoReferencia)
   .value();

 const dataPlot = _.chain(dataAñoReferencia.metrics)
   .map((metric) => ({
     indicador: metric,
     valor: dataAñoReferencia[metric],
     cambio: dataAñoReferencia.cambioAnual[metric],
     cambioPct:
       dataAñoReferencia.cambioAnual[metric] /
       (dataAñoReferencia[metric] - dataAñoReferencia.cambioAnual[metric])
   }))
   .filter(
     (d) =>
       !d.indicador.match(
         /administracion|asalariados|extranjeros|ocupacion_informal|sector_informal/
       )
   )
   .value();

 return Plot.plot({
   width,
   height: 300,
   marginLeft: 10,
   marginRight: 10,
   x: { tickFormat: "s", domain: [0, maxValue] },
   y: {
     tickSize: 0,
     tickFormat: (d) => "",
     domain: [
       "Ocupados",
       "Fuerza de Trabajo",
       "Personas en Edad de Trabajar",
       "Población Total"
     ]
   },
   marks: [
     Plot.barX(
       [{ tipo: "Población Total", personas: dataAñoReferencia.personas }],
       {
         x: "personas",
         y: (d) => "Población Total",
         fill: "tipo"
       }
     ),
     Plot.text(
       [{ tipo: "Población Total", personas: dataAñoReferencia.personas }],
       Plot.stackX({
         x: "personas",
         y: (d) => "Población Total",
         z: "tipo",
         fill: "#EEE",
         fontWeight: "bold",
         text: (d) => `${d["tipo"]}\n${d3.format(".3s")(d["personas"])}`
       })
     ),

     Plot.barX(
       [
         {
           tipo: "Personas en Edad de Trabajar",
           personas: dataAñoReferencia.PET
         },
         {
           tipo: "Menores de 15 años",
           personas: dataAñoReferencia.personas - dataAñoReferencia.PET
         }
       ],
       {
         x: "personas",
         y: (d) => "Personas en Edad de Trabajar",
         fill: "tipo"
       }
     ),
     ,
     Plot.text(
       [
         {
           tipo: "Personas en Edad de Trabajar",
           personas: dataAñoReferencia.PET
         },
         {
           tipo: "Menores de 15 años",
           personas: dataAñoReferencia.personas - dataAñoReferencia.PET
         }
       ],
       Plot.stackX({
         x: "personas",
         y: (d) => "Personas en Edad de Trabajar",
         z: "tipo",
         fill: "#EEE",
         fontWeight: "bold",
         text: (d) => `${d["tipo"]}\n${d3.format(".3s")(d["personas"])}`
       })
     ),

     Plot.barX(
       [
         { tipo: "Fuerza de Trabajo", personas: dataAñoReferencia.FT },
         {
           tipo: "Inactivas",
           personas: dataAñoReferencia.PET - dataAñoReferencia.FT
         }
       ],
       {
         x: "personas",
         y: (d) => "Fuerza de Trabajo",
         fill: "tipo"
       }
     ),
     Plot.text(
       [
         { tipo: "Fuerza de Trabajo", personas: dataAñoReferencia.FT },
         {
           tipo: "Inactivas",
           personas: dataAñoReferencia.PET - dataAñoReferencia.FT
         }
       ],
       Plot.stackX({
         x: "personas",
         y: (d) => "Fuerza de Trabajo",
         z: "tipo",
         fill: "#EEE",
         fontWeight: "bold",
         text: (d) => `${d["tipo"]}\n${d3.format(".3s")(d["personas"])}`
       })
     ),
     Plot.barX(
       [
         { tipo: "Ocupados", personas: dataAñoReferencia.O },
         { tipo: "Desocupados", personas: dataAñoReferencia.DO }
       ],
       {
         x: "personas",
         y: (d) => "Ocupados",
         fill: "tipo"
       }
     ),
     Plot.text(
       [
         { tipo: "Ocupados", personas: dataAñoReferencia.O },
         { tipo: "Desocupados", personas: dataAñoReferencia.DO }
       ],
       Plot.stackX({
         x: "personas",
         y: (d) => "Ocupados",
         z: "tipo",
         fill: "#EEE",
         fontWeight: "bold",
         text: (d) => `${d["tipo"]}\n${d3.format(".3s")(d["personas"])}`
       })
     )
   ]
 });
 
}


