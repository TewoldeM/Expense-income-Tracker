export type TransactionType = "income" | "expense"
export type Timeframe= "month" | "year" 
export type Period= {year: number, month: number}
// ?Timeframe

//The Timeframe type is an enumeration of two possible values: "month" and "year".
// This type is used to represent the timeframe for which data is being displayed.
//Think of it like a dropdown menu with two options: "Month" and "Year".
// When you select one of these options, the timeframe state variable is updated to reflect the chosen timeframe.

// ?Period

//The Period type is an object with two properties: year and month.
// This type is used to represent a specific period of time, such as a month and year.

// ?How they work together

// The timeframe and period state variables are used together to determine the range of data that is displayed.

// For example, if the timeframe is set to "month" and the period is set to { "year": 2022, "month": 9 },
// then the data displayed would be for the month of September 2022.

// If the timeframe is set to "year" and the period is set to { "year": 2022 },
// then the data displayed would be for the entire year of 2022.

//? Difference between Timeframe and Period

// The main difference between Timeframe and Period is that Timeframe represents a general timeframe (e.g. month or year),
//  while Period represents a specific period of time (e.g. a month and year).

// Think of it like a hierarchy:

// ?Timeframe is the top-level category (month or year)
// ?Period is a specific instance of that category (e.g. September 2022)


// ? timeframe is used to specify the general time range, such as "month" or "year". 
//This determines the granularity of the data you want to retrieve.

// ?period is used to specify the specific time range within the chosen timeframe. 
// For example, if you choose a timeframe of "month", you need to specify the specific month and year
//  for which you want to retrieve the data.