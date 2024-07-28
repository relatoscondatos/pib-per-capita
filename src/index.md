---
sql:
  pib_pc_current_usd: data/gdp_per_capita_current_us$.parquet
  pib_pc_ppp_constant_2021_international: data/gdp_per_capita_ppp_constant_2021_international$.parquet
  pib_pc_ppp_current_international: data/gdp_per_capita_ppp_current_international$.parquet
  ppp_conversion_factor: data/ppp_conversion_factor.parquet
  gdp_current_lcu: data/gdp_current_lcu.parquet
  gdp_constant_lcu: data/gdp_constant_lcu.parquet
  gdp_current_usd: data/gdp_current_us$.parquet
---


```sql id=dataIntegrada
SELECT 
  pib_pc_current_usd.country as country,
  pib_pc_current_usd.year as year,
  pib_pc_current_usd.value as pib_pc_current_usd,
  pib_pc_ppp_constant_2021_international.value as pib_pc_ppp_constant_2021_international,
  pib_pc_ppp_current_international.value as pib_pc_ppp_current_international
FROM pib_pc_current_usd
LEFT JOIN pib_pc_ppp_constant_2021_international 
  ON pib_pc_current_usd.country = pib_pc_ppp_constant_2021_international.country
  AND pib_pc_current_usd.year = pib_pc_ppp_constant_2021_international.year
LEFT JOIN pib_pc_ppp_current_international 
  ON pib_pc_current_usd.country = pib_pc_ppp_current_international.country
  AND pib_pc_current_usd.year = pib_pc_ppp_current_international.year
WHERE pib_pc_current_usd.year >= 1990
```

```js
const focus = _.chain([...dataIntegrada])
.groupBy(d => d.country)
.map((items,key) => ({
  country: key,
  items:items,
  year2018 : _.find(items, d => d.year == 2018),
  year2023 : _.find(items, d => d.year == 2023),
}))
.filter(d => d.year2018 && d.year2023 && ( d.year2018.pib_pc_ppp_constant_2021_international >= d.year2023.pib_pc_ppp_constant_2021_international))
.map(d => ({
  country:d.country,
  value2018 : d.year2018.pib_pc_ppp_constant_2021_international,
  value2023 : d.year2023.pib_pc_ppp_constant_2021_international,  
  year2018 : d.year2018,
  year2023 : d.year2023,

}))
.value()
display(focus)
display(Inputs.table([...dataIntegrada].filter(d => d.country == country)))
```

```sql id=pib_pc_current_usd
SELECT *
FROM pib_pc_current_usd
WHERE country = ${country}
 AND year >= 1990
```

```sql id=pib_pc_ppp_constant_2021_international
SELECT *
FROM pib_pc_ppp_constant_2021_international
WHERE country = ${country}
```


```sql id=countries
SELECT DISTINCT country
FROM pib_pc_ppp_constant_2021_international
WHERE NOT region IS NULL
```

```sql id=pib_pc_ppp_current_international
SELECT *
FROM pib_pc_ppp_current_international
WHERE country = ${country}
```

```sql id=pib_pc_ppp_current_international_2023
SELECT *
FROM pib_pc_ppp_current_international
WHERE year = ${año} AND region = 'Latin America & Caribbean'
```

```sql id=ppp_conversion_factor
SELECT *
FROM ppp_conversion_factor
```

```sql 
SELECT *
FROM ppp_conversion_factor
WHERE year = 2023 AND region like '%Latin%'
```

```sql id=gdp_current_lcu
SELECT *
FROM gdp_current_lcu
WHERE country = ${country}

```
```sql id=gdp_constant_lcu
SELECT *
FROM gdp_constant_lcu
WHERE country = ${country}

```

```sql id=gdp_current_usd
SELECT *
FROM gdp_current_usd
WHERE country = ${country}
```

```sql id=gdp_current_usd_all
SELECT *
FROM gdp_current_usd
```


```sql id=pib_pc_current_usd_all
SELECT *
FROM pib_pc_current_usd
```

```sql id=pib_pc_ppp_current_international_all
SELECT *
FROM pib_pc_ppp_current_international
```

```js
const chartYear = Plot.plot({
      title: "PIB per cápita PPP, current international $",
      subtitle: `Values for year ${año}`,
      grid: true,
      marginLeft:150,
      x: {label: "País"},
      y: {label: "PIB per capita"},
      color: {legend: true},
      marks: [
        Plot.barX(pib_pc_ppp_current_international_2023, {
          x: "value", 
          y: "country", 
          fill: d => d.country == "Chile" ? "red" :"PPP Current International $ (in 2023)",
          sort:{y:"x", reverse:true},
          tip:true
        }),
      ]
    })
```


```js
const chartChile = Plot.plot({
      title: `PIB per capita en ${country}`,
      grid: true,
      marginLeft:50,
      x: {label: "País"},
      y: {label: "PIB per capita"},
      color: {legend: true},
      marks: [
        Plot.lineY(pib_pc_current_usd, {x: "year", y: "value", stroke: d => "Current US$"}),
        Plot.dot(pib_pc_current_usd, {x: "year", y: "value", fill: d => "Current US$", tip:true}),
        Plot.lineY(pib_pc_ppp_constant_2021_international, {x: "year", y: "value", stroke: d => "PPP Constant 2021 International $"}),
        Plot.dot(pib_pc_ppp_constant_2021_international, {x: "year", y: "value", fill: d => "PPP Constant 2021 International $", tip:true}),
        Plot.lineY(pib_pc_ppp_current_international, {x: "year", y: "value", stroke: d => "PPP Current International $"}),        
        Plot.dot(pib_pc_ppp_current_international, {x: "year", y: "value", fill: d => "PPP Current International $", tip:true})
      ]
    })
```

```js
const chartPIB = (function() {

const dataPlot = [...gdp_current_usd_all].filter(d => d.country.match(/Chile|Colombia|New Zealand/) && d.year == 2023)
return Plot.plot({
      title: `PIB (Current US$) - Millones de US$`,
      grid: true,
      marginLeft:100,
      x: {
        label: "País",
        tickFormat: d => d3.format(".3s")(d/1000000)
        },
      y: {label: "PIB"},
      color: {legend: true},
      marks: [
        Plot.barX(dataPlot, {
          x: "value", 
          y: "country", 
          fill: "country",
          sort:{y:"x", reverse:true}
        }),
      ]
    })
})()
```


```js
const chartPIBPerCapita = (function() {

const dataPlot = [...pib_pc_current_usd_all].filter(d => d.country.match(/Chile|Colombia|New Zealand/) && d.year == 2023)
return Plot.plot({
      title: `PIB per cápita (Current US$)`,
      grid: true,
      marginLeft:100,
      x: {
        label: "País",
        tickFormat: d => d3.format(".3s")(d)
        },
      y: {label: "PIB"},
      color: {legend: true},
      marks: [
        Plot.barX(dataPlot, {
          x: "value", 
          y: "country", 
          fill: "country",
          sort:{y:"x", reverse:true}
        }),
      ]
    })
})()
```

```js
const chartPIBPerCapitaPPP = (function() {

const dataPlot = [...pib_pc_ppp_current_international_all].filter(d => d.country.match(/Chile|Colombia|New Zealand/) && d.year == 2023)
return Plot.plot({
      title: `PIB per cápita PPP (Current International $)`,
      grid: true,
      marginLeft:100,
      x: {
        label: "País",
        tickFormat: d => d3.format(".3s")(d)
        },
      y: {label: "PIB"},
      color: {legend: true},
      marks: [
        Plot.barX(dataPlot, {
          x: "value", 
          y: "country", 
          fill: "country",
          sort:{y:"x", reverse:true}
        }),
      ]
    })
})()
```




```js
const chartPPP = (function(){
  const dataPlot = [...ppp_conversion_factor].filter(d => d.country.match(/Chile|United States|United Kingdom|Switzerland|Argentina|Ecuador|Uruguay|Spain/))
  return Plot.plot({
    title: "PIB per capita en Chile",
    grid: true,
    marginLeft:50,
    marginRight:100,
    x: {label: "País"},
    y: {label: "PIB per capita"},
    color: {legend: true},
    marks: [
      Plot.lineY(dataPlot, {x: "year", y: "value", stroke: "country"}),
      Plot.dot(dataPlot, {x: "year", y: "value", fill: "country"}),
      Plot.text(dataPlot, Plot.selectLast({
        x: "year", 
        y: "value", 
        text: "country",
        z: "country",
        textAnchor:"start",
        dx:5
        })),

    ]
  })
})()


```

```js
const chartInternationalDolar = (function(){
  const dataPlot = [...ppp_conversion_factor].filter(d => d.country.match(/Chile|United States|United Kingdom|Switzerland|Argentina|Ecuador|Uruguay|Spain|Bolivia|Brazil/) && d.year == año)
  return Plot.plot({
    title: `Dolares internacionales por cada 100 dolares estadounidenses (${año})`,
    grid: true,
    marginLeft:200,
    marginRight:100,
    x: {label: "País"},
    y: {label: "PIB per capita"},
    color: {legend: true},
    marks: [
      Plot.barX(dataPlot, {y: "country", x: d => 100/d.value, fill: d => "Dólares internacionales",
      sort: {y:"x"}
      
      })
    ]
  })
})()


```


```js
const countryView = Inputs.select(_.chain([...countries]).map(d => d.country).sort().value(), { label: "Año"});
const country = view(countryView)
```

<div class="card">
  ${chartChile}
</div>
<div class="card">
  ${chartPIB}
</div>
<div class="card">
  ${chartPIBPerCapita}
</div>
<div class="card">
  ${chartPIBPerCapitaPPP}
</div>



```js
const añoView = Inputs.select(_.range(1990, 2024).reverse(), { label: "Año"});
const año = view(añoView)
```

<div class="card">
  ${chartYear}
</div>


<div class="card">
  ${chartPPP}
</div>
<div class="card">
  ${chartInternationalDolar}
</div>




