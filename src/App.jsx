import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

function App() {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <BrowserRouter>
            <Routes>
                <Route index /*index or path="/" */ element={<HomePage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="app" element={<AppLayout />}>
                    <Route index  element={<Navigate replace to='cities' />} />
                    <Route path="cities" element={<CityList isLoading={isLoading} cities={cities} />} />
                    <Route path="cities/:id" element={<City/>} />
                    <Route path="countries" element={<CountryList cities={cities} />} />
                    <Route path="form" element={<Form/>} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
