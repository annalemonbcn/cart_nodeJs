import { countries } from "countries-list";

const validCountries = Object.values(countries).map((c) => c.name);

export { validCountries };
