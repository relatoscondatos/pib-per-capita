import pandas as pd
import os
import io
import sys

base_path = "src/data/"

# List of parquet files and their corresponding indicators
files_and_indicators = {
    "gdp_constant_lcu.parquet": "gdp_constant_lcu",
    "gdp_constant_usd.parquet": "gdp_constant_usd",
    "gdp_current_lcu.parquet": "gdp_current_lcu",
    "gdp_current_usd.parquet": "gdp_current_usd",
    "gdp_growth.parquet": "gdp_growth",
    "gdp_per_capita_constant_lcu.parquet": "gdp_per_capita_constant_lcu",
    "gdp_per_capita_current_lcu.parquet": "gdp_per_capita_current_lcu",
    "gdp_per_capita_current_usd.parquet": "gdp_per_capita_current_usd",
    "gdp_per_capita_ppp_constant_2021_international.parquet": "gdp_per_capita_ppp_constant_2021_international",
    "gdp_per_capita_ppp_current_international.parquet": "gdp_per_capita_ppp_current_international",
}

# Initialize an empty dataframe
merged_df = pd.DataFrame()

# Loop through the files, read them, and merge them on common columns
for file, indicator in files_and_indicators.items():
    file_path = os.path.join(base_path, file)

    df = pd.read_parquet(file_path)
    
    # Filter for Chile
    df = df[df['country'] == 'Chile']
    
    # Rename the 'value' column to the specific indicator name
    df = df.rename(columns={"value": indicator})
    
    if merged_df.empty:
        merged_df = df
    else:
        # Merge on common columns ['country', 'countryCode', 'year', 'region', 'incomeGroup']
        merged_df = pd.merge(merged_df, df, on=['country', 'countryCode', 'year', 'region', 'incomeGroup'], how='outer')

# Create an in-memory buffer
buffer = io.BytesIO()

# Convert the DataFrame to a Parquet file in memory
merged_df.to_parquet(buffer, engine='pyarrow')

# Write the buffer content to sys.stdout
sys.stdout.buffer.write(buffer.getvalue())