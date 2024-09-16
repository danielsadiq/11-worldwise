/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

function CitiesProvider({children}){
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCites() {
            try {
				setIsLoading(true);
                const res = await fetch("http://localhost:8000/cities");
                const data = await res.json();
                setCities(data);
            } catch (error) {
                console.log(error);
            } finally{
				setIsLoading(false);				
			}
        }
        fetchCites();
        
    }, [setIsLoading, setCities]);

    async function getCity(id){
        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:8000/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading(false);				
        }
    }


    return <CitiesContext.Provider value={{
        cities,
        isLoading,
        setCities,
        setIsLoading,
        getCity,
        currentCity,
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