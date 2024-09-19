/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialItems = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
}

function reducer(state, action){
    switch (action.type) {
        case 'loading':
            return {...state, isLoading:true};
        case 'cities/loaded':
            return {...state, isLoading:false, cities:action.payload};
        case 'city/loaded':
            return {...state, isLoading:false, currentCity:action.payload};
        case 'city/created':
            return {...state, isLoading:false, cities: [...state.cities, action.payload], currentCity:action.payload}
        case 'city/deleted':
            return {...state, isLoading:false, cities: state.cities.filter(city => city.id !== action.payload), currentCity:{}}
        case 'rejected':
            return {...state, isLoading:false, error: action.paylaod};
        default:
            throw new Error("Unknown action type");
    }
}

function CitiesProvider({children}){
    const[{cities, isLoading, currentCity}, dispatch] = useReducer(reducer, initialItems);

    useEffect(function () {
        async function fetchCites() {
            try {
                dispatch({type:"loading"});
                const res = await fetch("http://localhost:8000/cities");
                const data = await res.json();
                dispatch({type: "cities/loaded", payload:data});
            } catch (error) {
                dispatch({type:'rejected',paylaod: "There was an error loading the cities..."})
            }
        }
        fetchCites();
        
    }, []);

    async function getCity(id){
        if (currentCity.id === Number(id)){
            dispatch({type: "city/loaded", payload:currentCity});
            return;
        }
        dispatch({type:"loading"});
        try {
            const res = await fetch(`http://localhost:8000/cities/${id}`);
            const data = await res.json();
            dispatch({type: "city/loaded", payload:data});
        } catch (error) {
            dispatch({type:'rejected',paylaod: "There was an error loading the city..."})
        } 
    }

    async function createCity(newCity){
        dispatch({type:"loading"});
        try {
            const res = await fetch(`http://localhost:8000/cities/`, {
                method:'POST',
                body: JSON.stringify(newCity),
                headers:{
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            dispatch({type:"city/created", payload:data})
        } catch (error) {
            dispatch({type:'rejected',paylaod: "There was an error creating the city"})
        }
    }

    async function deleteCity(id){
        dispatch({type:"loading"});
        try {
            await fetch(`http://localhost:8000/cities/${id}`, {
                method:'DELETE',
            });
            dispatch({type:"city/deleted", paylaod:id});
        } catch (error) {
            dispatch({type:'rejected', paylaod: "There was an error loading the data"})
        }
    }


    return <CitiesContext.Provider value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
    }}>
        {children}
    </CitiesContext.Provider>
}

function useCities(){
    const context = useContext(CitiesContext);
    if (context === undefined){
        throw new Error("Cities context was used outside the cities Provider.")
    }
    return context
}

// eslint-disable-next-line react-refresh/only-export-components
export {CitiesProvider, CitiesContext, useCities}