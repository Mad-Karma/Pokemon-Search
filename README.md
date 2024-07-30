# Pokemon-Search

A React application (my very first) to search for a Pokémon. A basic search application connected to an API, using HTTP Requests and React Queries. 

## Functionalities

It supports searches for specific names and partial names. When a name is searched, a query is made to PokeAPI (https://pokeapi.co) to get information about the searched Pokémon. In the case of searching using a partial name, it shows the information of the first-found match by searching through a list of all the Pokémon (obtained through a query). The user can also cycle through the available Pokémon using the Previous/Next buttons.

To avoid making queries to the API in each search, React Query was used, which allows the results to stay in cache for a period of time. In order to minimize the loading time, a prefetch of the previous/next Pokémon is done.

Also the the queries were set to not start on their own, so that they are only executed when needed, using a refetch.

## How to run

To run the application use `npm start`.

If you want to run the automated tests use `npm test`

## Automated tests

There are 4 available automated tests:
 - Normal search (pikachu)
 - Partial search (pikac)
 - Using the previous button (from Pikachu)
 - Using the next button (from Pikachu)

## Dependencies

The package.json file is set to install all dependencies, if something is missing use the commands below.

Necessary dependencies:
- React e React DOM `npm install react react-dom`
- React Query `npm install @tanstack/react-query`
- Axios `npm install axios`

It is recommended to use `npm update` to avoid any troubles.
