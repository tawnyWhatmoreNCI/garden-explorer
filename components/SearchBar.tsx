import { useRouter } from "next/router";
import {useState, ChangeEvent} from "react";
import styles from '../styles/SearchBar.module.css';

{/* Guide: https://dev.to/stephengade/build-a-functional-search-bar-in-nextjs-mig */}
const SearchBar = ({defaultValue }: {defaultValue: string | null}) => {
    const router = useRouter();
    //grab any search params and use as default value
    const [inputValue, setValue] = useState<string | null>(defaultValue);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue: string = event.target.value;
        setValue(inputValue);
    }

    //handle submission routing
    const handleSearch = () => {
        if (inputValue) {
            router.push(`/community?q=${inputValue}`)
        }
        
        if(!inputValue){
            router.push(`/community`)
        }
    }
    //handle the user clicking enter on keyboard for submit
    const handleKeyPress = (event: {key: any}) => {
        if(event.key === 'Enter') return handleSearch();
    }

    return (
        <div className={styles.searchRow}>
            <input className={"inputBar"} type="text" placeholder="Search..." value={inputValue ?? ""} onChange={handleChange} onKeyDown={handleKeyPress} />
            <button className={`${styles.searchSubmit} actionButton`} onClick={handleSearch}>Search</button>
        </div>
    )
}

export default SearchBar;