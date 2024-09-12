/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import styles from './CountryList.module.css'
import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";

function CountryList({ isLoading, cities }) {
    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country)) {
            return [...arr, {country: city.country, emoji:city.emoji}]
        } else {
            return arr
        }
    }, []);

    if (isLoading) return <Spinner />;
    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on a city in the map" />
        );
    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={country.country} />
            ))}
        </ul>
    );
}

export default CountryList;
