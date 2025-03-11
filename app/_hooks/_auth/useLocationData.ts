import { OnboardingFormData } from "@/app/_types/_auth/auth-types";
import { ICity, IState } from "country-state-city";
import { Country, State, City } from "country-state-city";
import React from "react";


interface LocationData {
    allCities: ICity[];
    allStates: IState[];
    filteredCities: ICity[];
}

export const useLocationData = (formData: OnboardingFormData, citySearch: string): LocationData => {
    const [allCities, setAllCities] = React.useState<ICity[]>([]);
    const [allStates, setAllStates] = React.useState<IState[]>([]);
    const allCountries = Country.getAllCountries();

    React.useEffect(() => {
        if (formData.country) {
            const selectedCountry = allCountries.find(c => c.name === formData.country);
            if (selectedCountry) {
                const states = State.getStatesOfCountry(selectedCountry.isoCode) || [];
                setAllStates(states);
            }
        }
    }, [formData.country]);

    React.useEffect(() => {
        if (formData.country && formData.state) {
            const selectedCountry = allCountries.find(c => c.name === formData.country);
            const selectedState = allStates.find(s => s.name === formData.state);

            if (selectedCountry && selectedState) {
                const cities = City.getCitiesOfState(
                    selectedCountry.isoCode,
                    selectedState.isoCode
                ) || [];
                setAllCities(cities);
            }
        }
    }, [formData.country, formData.state]);

    const filteredCities = allCities.filter(city =>
        city?.name?.toLowerCase().includes(citySearch.toLowerCase())
    );

    return { allCities, allStates, filteredCities };
};