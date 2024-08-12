---
sql:
  gdp_chile: data/gdp_indicators_chile.parquet
  gdp_per_capita_current_usd: data/gdp_per_capita_current_usd.parquet
  gdp_per_capita_ppp_current_international: data/gdp_per_capita_ppp_current_international.parquet
  gdp_per_capita_ppp_constant_2021_international: data/gdp_per_capita_ppp_constant_2021_international.parquet
  gdp_current_usd: data/gdp_current_usd.parquet
---

```js
const cases = await FileAttachment("data/cases.json").json();
const text = "a<p>b"
``` 







```sql id=data_gdp_chile
SELECT *
FROM gdp_chile
```

```sql id=data_gdp_per_capita_current_usd
SELECT *
FROM gdp_per_capita_current_usd
```

```sql id=data_gdp_current_usd
SELECT *
FROM gdp_current_usd
```


```sql id=data_total_vs_percapita 
SELECT total.countryCode,total.country, total.year, 
  total.value as total, 
  pc.value as pc , 
  pc_ppp.value as pc_ppp,
  pc_ppp_constant.value as pc_ppp_constant
FROM gdp_current_usd total
INNER JOIN gdp_per_capita_current_usd pc 
  ON total.countryCode = pc.countryCode
  AND total.year = pc.year
INNER JOIN gdp_per_capita_ppp_current_international pc_ppp 
  ON total.countryCode = pc_ppp.countryCode
  AND total.year = pc_ppp.year
INNER JOIN gdp_per_capita_ppp_constant_2021_international pc_ppp_constant
  ON total.countryCode = pc_ppp_constant.countryCode
  AND total.year = pc_ppp_constant.year
WHERE total.year = 2023
```

```sql id=data_countries_over_time 
SELECT total.countryCode,total.country, total.year, 
  total.value as total, 
  pc.value as pc , 
  pc_ppp.value as pc_ppp,
  pc_ppp_constant.value as pc_ppp_constant
FROM gdp_current_usd total
INNER JOIN gdp_per_capita_current_usd pc 
  ON total.countryCode = pc.countryCode
  AND total.year = pc.year
INNER JOIN gdp_per_capita_ppp_current_international pc_ppp 
  ON total.countryCode = pc_ppp.countryCode
  AND total.year = pc_ppp.year
INNER JOIN gdp_per_capita_ppp_constant_2021_international pc_ppp_constant
  ON total.countryCode = pc_ppp_constant.countryCode
  AND total.year = pc_ppp_constant.year
ORDER BY total.country, total.year
```

```js
/*
(function() {
  const dataPlot = [...data_total_vs_percapita]
  return Plot.plot({
    caption:fuenteWB,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB Total",
      grid:true,
      type:"log"
    },    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita",
      grid:true,
      type:"log"
    },
    marks:[
      Plot.dot(dataPlot, {
        x:"total",
        y:d => d["pc"],
        fill:d => d.country == "Chile" ? "orange" : "grey",
        channels:{Pais:"country"},
        tip:true
      })
    ]
  })
  

})()
*/
```


```js
const fuenteWB = `Fuente: Datos de cuentas nacionales del Banco Mundial y archivos de datos de Cuentas Nacionales de la OCDE.`
```


# PIB (Producto Interno Bruto)

El PIB (Producto Interno Bruto) es una medida que nos ayuda a entender cuánto produce en total un país en un período de tiempo, generalmente un año. Imagina que sumamos el valor de todos los productos y servicios que se crean dentro de un país, como si estuviéramos calculando el precio total de todo lo que se fabrica y se vende en las tiendas, se produce en las fábricas, se cultiva en los campos, y se ofrecen como servicios, desde la educación hasta el transporte.

Además, al calcular el PIB, también añadimos los impuestos que pagamos por esos productos y servicios, y restamos los subsidios que el gobierno puede dar para abaratar algunos productos. Este cálculo no incluye el desgaste de las máquinas ni la pérdida de recursos naturales, proporcionando así una visión general del valor total generado en la economía.

Esta cifra es importante porque nos da una idea del tamaño de la economía y de cómo está creciendo o disminuyendo en comparación con otros años o con otros países.

Según definifión del Banco Mundial:
*"El PIB a precio de comprador es la suma del valor agregado bruto de todos los productores residentes en la economía más todo impuesto a los productos, menos todo subsidio no incluido en el valor de los productos. Se calcula sin hacer deducciones por depreciación de bienes manufacturados o por agotamiento y degradación de recursos naturales."*
## PIB en Chile ($ Pesos chilenos nominales)
A continuación, presentamos un gráfico que muestra el Producto Interno Bruto (PIB) de Chile desde 1960 hasta 2023, expresado en pesos nominales. Es importante destacar que estas cifras no han sido ajustadas por la inflación, lo que significa que reflejan el total de la economía en los precios de cada año. Esto implica que no se consideran los cambios en el poder adquisitivo del dinero con el tiempo. Por ejemplo, un peso en 1960 no tiene el mismo valor que un peso en 2023, lo que explica el aumento visible en el gráfico.
```js
(function() {
  const dataPlot = [...data_gdp_chile]
  return Plot.plot({
    caption:fuenteWB,
    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB (Millones de pesos)",
      grid:true,
    },
    marks:[
      Plot.lineY(dataPlot, {
        x:"year",
        y:d => d["gdp_current_lcu"]/1000000,
        stroke:d => "PIB",
        strokeWidth:3,
        tip:true
      })
    ]
  })

})()
```

## Evolución del PIB en Chile Ajustado por Inflación (Pesos Reales de 2018)
A continuación, presentamos un gráfico que muestra el Producto Interno Bruto (PIB) de Chile desde 1960 hasta 2023, expresado en pesos reales, ajustados por inflación. Esto significa que los valores han sido corregidos para reflejar el poder adquisitivo constante del dinero, permitiendo una comparación más precisa del crecimiento económico a lo largo del tiempo. Aquí hemos utilizado 2018 como año de referencia, ajustando todos los valores para reflejar el mismo poder adquisitivo que en 2018. Esto nos permite observar el verdadero crecimiento de la economía chilena, eliminando el efecto de la inflación.
```js
(function() {
  const dataPlot = [...data_gdp_chile]
  return Plot.plot({
    caption:fuenteWB,
    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB (Millones de pesos)",
      grid:true,
    },
    marks:[
      Plot.lineY(dataPlot, {
        x:"year",
        y:d => d["gdp_constant_lcu"]/1000000,
        stroke:d => "PIB",
        strokeWidth:3,
        tip:true
      })
    ]
  })

})()
```

## Variación anual del PIB en Chile: 1960 a 2023
En esta sección, presentamos un gráfico que muestra la variación anual del Producto Interno Bruto (PIB) de Chile desde 1961 hasta 2023, expresado en porcentajes. Este gráfico permite observar cómo ha cambiado la economía chilena a lo largo del tiempo, mostrando tanto los períodos de crecimiento como los de contracción. Para facilitar la interpretación, se han marcado los distintos gobiernos que han estado en el poder durante este período, lo que permite contextualizar los cambios económicos dentro de los marcos políticos correspondientes.

```js
(function() {

  const dataPlot = [...data_gdp_chile]
  const maxValue = _.chain(dataPlot).map(d => d.gdp_growth/100).max().value();
  const minValue = _.chain(dataPlot).map(d => d.gdp_growth/100).min().value();
  return Plot.plot({
    caption:fuenteWB,

    width:1000,
    marginBottom:50,
    marginLeft:100,
    marginTop:40,

    x:{
      tickRotate:90,
      tickFormat: "d"
    },  
    y:{
      tickFormat:d => d3.format(".1%")(d),
      label: "Variación anual del PIB (%)",
      grid:true
    },
    marks:[
      Plot.rectY([
        { from:1958, to:1963},
        { from:1970, to:1973},
        { from:1990, to:1993},
        { from:2000, to:2005},
        { from:2010, to:2013},
        { from:2018, to:2021},
        ], 
      {x1: "from", x2: "to", y1:minValue,y2:maxValue,fill:"lightgrey"}),    
      Plot.text([
        { year:1961, name:"Alessandri"},
        { year:1967, name:"Frei M."},
        { year:1971, name:"Allende"},
        { year:1982, name:"Pinochet"},
        { year:1991, name:"Aylwin"},
        { year:1997, name:"Frei RT."},
        { year:2002, name:"Lagos"},
        { year:2007, name:"Bachelet"},
        { year:2011, name:"Piñera"},
        { year:2016, name:"Bachelet"},
        { year:2020, name:"Piñera"},
        { year:2023, name:"Boric"},
      ],
      {x: "year", y:maxValue, text:"name", dy:-10}),
      Plot.barY(dataPlot, {
        x:"year",
        y:d => d.gdp_growth/100,
        fill: d => "constant"
      })
    ]
  })
  })()
```
* **Crecimiento en los Años 60 y 70**: Durante los años 60, Chile experimentó un crecimiento económico moderado. Sin embargo, a principios de los años 70, durante el gobierno de Salvador Allende, la economía sufrió una marcada contracción debido a una combinación de políticas económicas, inestabilidad política y crisis internas.
* **Contracción en 1975**: En 1975, bajo el gobierno de Pinochet, la economía chilena sufrió una fuerte contracción. Este colapso fue en parte resultado de la crisis económica que se arrastraba desde los años previos, así como de las primeras políticas de ajuste impuestas por el régimen militar para estabilizar la economía.
* **Crisis de 1982**: Una caída pronunciada en el gráfico corresponde a la crisis de 1982, también durante la dictadura de Pinochet, cuando la economía se contrajo drásticamente debido a la crisis de la deuda externa. Este evento resultó en una recesión profunda que afectó gravemente al país.

* **Retorno a la Democracia y Crecimiento en los 90**: Con el retorno a la democracia en 1990, Chile entró en una nueva fase de crecimiento sostenido, impulsado por reformas económicas y una mayor estabilidad política. Durante los gobiernos de Aylwin y Frei Ruiz-Tagle, el país experimentó un crecimiento económico notable, en gran parte gracias a la apertura al comercio internacional y a la inversión extranjera.

* **Crisis Asiática**: A finales de los 90, Chile enfrentó nuevos desafíos con la crisis asiática de 1997-1998, que provocó una desaceleración significativa en el crecimiento económico, afectando principalmente al gobierno de Frei Ruiz-Tagle.

* **Volatilidad en los 2000**: Durante los gobiernos de Lagos, Bachelet, y Piñera, el crecimiento económico mostró altibajos, influenciado por eventos globales como la crisis financiera de 2008.
* **Impacto de la Pandemia en 2020**: Aunque la pandemia de COVID-19 en 2020 provocó una significativa contracción económica, esta caída no fue tan severa como la de 1982. Sin embargo, la recuperación en 2021 fue rápida bajo el gobierno de Piñera.
* **Estabilidad Reciente**: En los últimos años, el crecimiento se ha estabilizado, aunque en niveles más bajos que en décadas anteriores, reflejando desafíos económicos persistentes y una economía en fase de ajuste.



```js
/*
(function() {
  const dataPlot = [...data_total_vs_percapita]
  return Plot.plot({
    caption:fuenteWB,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita PPA",
      grid:true,
      type:"log"
    },    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita",
      grid:true,
      type:"log"
    },
    marks:[
      Plot.dot(dataPlot, {
        x:"pc_ppp",
        y:d => d["pc"],
        fill:d => d.country == "Chile" ? "orange" : "grey",
        channels:{Pais:"country"},
        tip:true
      })
    ]
  })

})()
*/
```

## PIB total vs PIB per capita

En esta sección, comparamos el Producto Interno Bruto (PIB) de Chile, Islandia e Indonesia en términos de PIB total y PIB per cápita para el año 2023. Usamos dólares estadounidenses (US$) en lugar de las monedas locales, lo que facilita una comparación directa entre economías diferentes. Sin embargo, es importante destacar que esta metodología tiene limitaciones, que abordaremos más adelante.

El primer gráfico muestra el PIB total de Chile, Islandia e Indonesia en dólares estadounidenses. Como se puede observar, Indonesia tiene un PIB total significativamente mayor, debido principalmente a su gran tamaño poblacional y extensión geográfica. En contraste, Islandia tiene un PIB total considerablemente menor, reflejando su pequeña población y economía en comparación con los otros dos países.

```js
(function() {
  const dataPlot = [...data_total_vs_percapita].filter(d => d.country.match(/Iceland|Chile|Indonesia/))
  return Plot.plot({
    title:"PIB en Chile, Islandia e Indonesia (US$)",
    caption:fuenteWB,
    marginLeft:100,
    marginRight:50,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB (millones de US$)",
      grid:true,
    }, y:{
      label:""
    },
    marks:[
      Plot.barX(dataPlot, {
        x: d => d["total"]/1000000,
        y:"country",
        fill:d => d.country == "Chile" ? "orange" : "grey",
        tip:true
      }),
      Plot.text(dataPlot, {
        x: d => d["total"]/1000000,
        y:"country",
        text: d => `${d3.format(".2s")(d["total"]/1000000)}`,
        textAnchor:"start",
        dx:5,
        tip:true
      })
    ]
  })

})()
```
El segundo gráfico presenta el PIB per cápita de los mismos tres países. Aquí, el orden se invierte: Islandia, a pesar de tener el PIB total más bajo, muestra el PIB per cápita más alto. Esto se debe a su pequeña población, lo que significa que la riqueza total del país, cuando se divide entre sus habitantes, es mayor. Por otro lado, Indonesia, con una población mucho mayor, tiene el PIB per cápita más bajo, reflejando que la riqueza total se distribuye entre un número mucho mayor de personas.


```js
(function() {
  const dataPlot = [...data_total_vs_percapita].filter(d => d.country.match(/Iceland|Chile|Indonesia/))
  return Plot.plot({
    title:"PIB per capita en Chile, Islandia e Indonesia (US$)",
    caption:fuenteWB,
    marginLeft:100,
    marginRight:50,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita (US$)",
      grid:true,
    }, y:{
      label:""
    },

    marks:[
      Plot.barX(dataPlot, {
        x: d => d["pc"],
        y:"country",
        fill:d => d.country == "Chile" ? "orange" : "grey",
      }),
      Plot.text(dataPlot, {
        x: d => d["pc"],
        y:"country",
        text: d => `US$${d3.format(".2s")(d["pc"])}`,
        textAnchor:"start",
        dx:5,
        tip:true
      })
    ]
  })

})()
```
Es fundamental destacar que el uso de dólares estadounidenses para comparar el PIB entre diferentes países no siempre refleja con precisión el poder adquisitivo real en cada país. El costo de vida, los precios locales, y otros factores pueden variar significativamente, lo que significa que un mismo monto en US$ puede tener un valor adquisitivo muy distinto en cada país. Más adelante, exploraremos otras formas de medir y comparar economías que tienen en cuenta estas diferencias.

## Comparación del PIB per Cápita Ajustado por Paridad de Poder Adquisitivo (PPA) en 2023

Para comparar economías de diferentes países, el uso del dólar estadounidense (US$) no siempre es el más adecuado, debido a que el costo de vida y los precios de los bienes y servicios pueden variar significativamente entre naciones. Es por esto que se utiliza un concepto llamado Paridad de Poder Adquisitivo (PPA). La PPA ajusta las cifras del PIB per cápita para reflejar mejor el poder adquisitivo real dentro de cada país, es decir, cuánto pueden comprar los ciudadanos con su ingreso en términos locales.

Cuando hablamos de "dólares internacionales" (a veces referidos incorrectamente como US$), nos referimos a una unidad de medida que estandariza el poder de compra a nivel global, permitiendo comparaciones más justas entre países. Estos "dólares internacionales" no son la misma moneda que los dólares estadounidenses, aunque comparten una notación similar en algunos informes. Es más preciso llamarlos "dólares internacionales" o simplemente "$ internacionales" para evitar confusiones.

El siguiente gráfico muestra el PIB per cápita de Chile, Islandia e Indonesia para el año 2023, ajustado por PPA en dólares internacionales nominales.

#### PIB en Chile, Islandia e Indonesia ($ internacionales)


```js
Plot.legend({
  color: {
    type: "categorical", 
    domain:["PIB per Capita (US$)"]
    }
  })
```

```js

(function() {
  const dataPlot = [...data_total_vs_percapita].filter(d => d.country.match(/Iceland|Chile|Indonesia/))
  return Plot.plot({
    caption:fuenteWB,
    marginLeft:100,
    marginRight:50,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita PPA ($ internacionales)",
      grid:true,
    }, y:{
      label:""
    },
    marks:[

      Plot.barX(dataPlot, {
        x: d => d["pc_ppp"],
        y:"country",
        fill:d => d.country == "Chile" ? "orange" : "lightgrey",
        tip:true
      }),
      Plot.tickX(dataPlot, {
        x: d => d["pc"],
        y:"country",
        stroke:d =>  d3.schemeTableau10[0] ,
        strokeWidth:2,
        tip:true
      }),
      Plot.text(dataPlot, {
        x: d => d["pc_ppp"],
        y:"country",
        text: d => `$${d3.format(".2s")(d["pc_ppp"])}`,
        textAnchor:"start",
        dx:5,
        tip:true
      })
    ]
  })

})()
```
**Indonesia**: Utilizando este ajuste, el PIB per cápita de Indonesia aumenta sustancialmente, pasando de aproximadamente $5,000 en dólares estadounidenses a $16,000 en dólares internacionales. Esto refleja que, aunque los ingresos en términos de dólares estadounidenses son bajos, el costo de vida en Indonesia es también significativamente más bajo, lo que aumenta el poder adquisitivo de sus ciudadanos.  
**Chile**: En Chile, el PIB per cápita también experimenta un aumento, de aproximadamente $17,000 en dólares estadounidenses a $33,000 en dólares internacionales, indicando que el costo de vida en Chile es más bajo que en países con un PIB per cápita similar en dólares estadounidenses.  
**Islandia**: Por otro lado, el PIB per cápita de Islandia baja ligeramente de $79,000 en dólares estadounidenses a $78,000 en dólares internacionales. Esto sugiere que, aunque los ingresos en dólares estadounidenses son altos, los precios en Islandia también son elevados, lo que reduce ligeramente el poder adquisitivo en comparación con lo que reflejan las cifras en dólares estadounidenses.  

Este indicador de PPA es útil para obtener una visión más realista del bienestar económico de las personas en diferentes países, permitiendo una comparación más justa y precisa entre economías con diferentes niveles de precios y costos de vida.


## Países con similar PIB per capita en US$, pero con diferencias al ajustar por Paridad de Poder Adquisitivo (PPA)

En este gráfico se presentan tres países —Costa Rica, Chile y Rumania— que tienen un PIB per cápita similar en dólares estadounidenses (US$) para el año 2023. Sin embargo, al ajustar estas cifras utilizando la Paridad de Poder Adquisitivo (PPA) en dólares internacionales, observamos diferencias notables en el PIB per cápita de cada país. Este ajuste nos permite una comparación más justa entre economías al considerar las variaciones en el costo de vida y el poder adquisitivo real de sus ciudadanos.

```js
Plot.legend({
  color: {
    type: "categorical", 
    domain:["PIB per Capita (US$)"]
    }
  })
```

```js

(function() {
  const dataPlot = [...data_total_vs_percapita].filter(d => d.country.match(/Costa Rica|Chile|Romania/))
  return Plot.plot({
    caption:fuenteWB,
    marginLeft:100,
    marginRight:70,
    x:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita PPA ($ internacionales)",
      grid:true,
    }, y:{
      label:""
    },
    marks:[

      Plot.barX(dataPlot, {
        x: d => d["pc_ppp"],
        y:"country",
        fill:d => d.country == "Chile" ? "orange" : "lightgrey",
        tip:true
      }),
      Plot.tickX(dataPlot, {
        x: d => d["pc"],
        y:"country",
        stroke:d =>  d3.schemeTableau10[0] ,
        strokeWidth:2,
        tip:true
      }),
      Plot.text(dataPlot, {
        x: d => d["pc_ppp"],
        y:"country",
        text: d => `$${d3.format(".2s")(d["pc_ppp"])}`,
        textAnchor:"start",
        dx:5,
        tip:true
      })
    ]
  })

})()
```

* **Costa Rica**: Con un PIB per cápita de aproximadamente $16,595 en dólares estadounidenses, Costa Rica muestra un PIB per cápita PPA de $27,952 en dólares internacionales. Esto indica que, aunque los ingresos en términos de dólares estadounidenses son relativamente modestos, el poder adquisitivo de los costarricenses es significativamente mayor al ajustarse por el costo de vida local.
* **Chile**: Chile, con un PIB per cápita en dólares estadounidenses de alrededor de $17,093, alcanza un PIB per cápita PPA de $33,284 en dólares internacionales. Esto refleja que el costo de vida en Chile permite que los ingresos tengan un mayor poder adquisitivo en comparación con lo que sugieren las cifras en dólares estadounidenses.
* **Rumania**: Rumania, con un PIB per cápita en dólares estadounidenses de $18,419, muestra un incremento considerable al ajustarse por PPA, alcanzando $47,903 en dólares internacionales. Este aumento significativo revela que, a pesar de que los ingresos en términos de dólares estadounidenses son comparables a los de Costa Rica y Chile, el costo de vida en Rumania es relativamente bajo, lo que permite un poder adquisitivo mucho mayor.


Este gráfico ilustró cómo el ajuste por Paridad de Poder Adquisitivo puede cambiar drásticamente la percepción de la riqueza relativa entre países. Aunque estos tres países tienen un PIB per cápita similar cuando se mide en dólares estadounidenses, sus ciudadanos experimentan diferentes niveles de bienestar económico en función del poder adquisitivo real, con Rumania mostrando la mayor ventaja bajo este enfoque.


## PIB per cápita PPA ajustado por inflación ($ internacionales reales)

En esta sección, abordamos un aspecto adicional importante cuando se compara la evolución del PIB per cápita a lo largo del tiempo: la **inflación**. Hasta ahora, hemos hablado del PIB per cápita ajustado por Paridad de Poder Adquisitivo (PPA) en dólares internacionales, lo que permite comparaciones más justas entre diferentes países. Sin embargo, cuando queremos ver cómo ha cambiado este indicador en el tiempo, necesitamos también ajustar las cifras por inflación para poder comparar de manera significativa entre años diferentes.

### ¿Por qué ajustar por inflación?

El ajuste por inflación es necesario porque los precios de bienes y servicios tienden a subir con el tiempo, lo que significa que el valor de dinero disminuye. Si no ajustamos por inflación, podríamos pensar que la economía ha crecido más de lo que realmente ha crecido en términos de poder adquisitivo. Por ello, en vez de usar los **dólares internacionales nominales** (que reflejan el valor actual en cada año), usamos **dólares internacionales reales** o **constantes** de un año de referencia, en este caso, 2021. Esto nos permite comparar el PIB per cápita de diferentes años como si todos estuvieran en los mismos términos de precios.

El gráfico compara el PIB per cápita ajustado por PPA en dólares internacionales nominales (en color amarillo) y en dólares internacionales reales o constantes de 2021 (en color azul).

Línea Amarilla (Dólares Internacionales Nominales): Esta línea muestra el PIB per cápita en términos de los precios que estaban vigentes en cada año, lo que refleja el crecimiento sin considerar los efectos de la inflación.
Línea Azul (Dólares Internacionales Reales de 2021): Esta línea ajusta todas las cifras para reflejar los precios constantes de 2021. Al hacerlo, nos da una visión más precisa de cómo ha cambiado el poder adquisitivo real del PIB per cápita a lo largo del tiempo, eliminando el impacto de la inflación.
```js
(function() {
  const dataPlot = [...data_gdp_chile].filter(d => d.year >= 1990)
  return Plot.plot({
    caption:fuenteWB,
    x:{
      grid:true
    },
    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita ($ internacionales)",
      grid:true,
    },
    color:{
      legend:true,
      domain:[
        "PIB per capita PPA ($ internacionales reales - base 2021)",
        "PIB per capita PPA ($ internacionales nominales)",

      ]
    },
    marks:[
      Plot.lineY(dataPlot, {
        x:"year",
        y:d => d["gdp_per_capita_ppp_current_international"],
        stroke:d => "PIB per capita PPA ($ internacionales nominales)",
        strokeWidth:3,
        tip:true
      }),
      Plot.lineY(dataPlot, {
        x:"year",
        y:d => d["gdp_per_capita_ppp_constant_2021_international"],
        stroke:d => "PIB per capita PPA ($ internacionales reales - base 2021)",
        strokeWidth:3,
        tip:true
      })
    ]
    
  })

})()
```
Como se observa en el gráfico, el PIB per cápita en dólares internacionales reales (línea azul) crece de manera más suave y continua en comparación con los valores nominales (línea amarilla). Esto se debe a que la inflación influyó en el valor nominal de los ingresos, pero al ajustar estos valores a precios constantes de 2021, obtenemos una visión más precisa del crecimiento real. Este enfoque nos permite entender mejor cómo ha evolucionado la economía de un país, no solo en términos de dinero, sino en términos de poder adquisitivo real, que es lo que realmente importa para los ciudadanos.

Este ajuste es esencial para obtener una perspectiva precisa y clara del desarrollo económico a lo largo del tiempo.

## Evolución en el tiempo del PIB per capita de Chile vs países que lo superaban en 1990

En este gráfico, presentamos una comparación del PIB per cápita ajustado por Paridad de Poder Adquisitivo (PPA) en dólares internacionales reales (base 2021) entre Chile y una selección de países: Argentina, México, Brasil, y Ucrania. La línea temporal se extiende desde 1990 hasta 2023.

Lo que destaca en este análisis es la evolución relativa del PIB per cápita de Chile en comparación con estos países. En 1990, todos estos países tenían un PIB per cápita superior al de Chile. Sin embargo, a lo largo de las últimas décadas, Chile ha experimentado un crecimiento sostenido que le ha permitido superar a cada uno de ellos en términos de PIB per cápita ajustado por PPA en 2023.

Este gráfico es un claro ejemplo de cómo las políticas económicas, la estabilidad, y otros factores pueden influir en el crecimiento económico de un país, permitiendo cambios significativos en su posición relativa frente a otras economías en un período de tiempo.
```js
(function() {
  const dataPlot = [...data_countries_over_time].filter(d => d.country.match(/Brazil|Chile|Ukraine|Mexico|Argentina/))
  return Plot.plot({
    caption:fuenteWB,
    marginLeft:100,
    marginRight:70,
    x:{
      tickFormat: d => d3.format("d")(d),
      label: "PIB per capita PPA ($ internacionales reales, base 2021)",
      grid:true,
    }, y:{
      label:""
    },

    marks:[
      Plot.lineY(dataPlot, {
        x: d => d["year"],
        y:"pc_ppp_constant",
        stroke:"country",
      }),
      Plot.text(dataPlot, Plot.selectLast({
        x: d => d["year"],
        y:"pc_ppp_constant",
        z:"country",
        text:"country",
        textAnchor:"start",
        dx:5
      }))
    ]
  })

})()
```

## Casos notables


```js
const paisSeleccionado = view(Inputs.select(cases, {label: "País", format: x => x.label, value:cases[0]}));
```

```js
const node = d3.select("body")
.append("div")
.html(paisSeleccionado.desc)
```

```js

```

### ${paisSeleccionado.label} - PIB per cápita
*${paisSeleccionado.intro}*
${countryCurve({country:paisSeleccionado.country})}
${html`${node.node()}`}


```js
function countryCurve({country = "Chile"} = {}) {
   const countryRegExp = new RegExp(country)
   const dataPlot = [...data_countries_over_time].filter(d => d.country.match(countryRegExp))
  return Plot.plot({
    caption:fuenteWB,
    marginLeft:100,
    marginRight:100,
    x:{
      tickFormat: d => d3.format("d")(d),
      label: "Año",
      grid:true,
    },
    y:{
      tickFormat: d => d3.format(".2s")(d),
      label: "PIB per capita PPA ($ internacionales reales, base 2021)",
      grid:true,
    }, 

    marks:[
      Plot.lineY(dataPlot, {
        x: d => d["year"],
        y:"pc_ppp_constant",
        stroke:d => "country",
        channels:{"País":"country", 
          "PIB per cápita": "pc_ppp_constant",
          "Año":"year",

          },
        tip:true
      }),
      Plot.text(dataPlot, Plot.selectLast({
        x: d => d["year"],
        y:"pc_ppp_constant",
        z:"country",
        text:"country",
        textAnchor:"start",
        dx:5
      }))
    ]
  })
}
```

