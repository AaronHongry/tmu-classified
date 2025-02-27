import { SearchBar } from "./searchBar";
import { LocationSelect } from "./location";
import { CategoriesBar } from "./categories";

export const SearchSection: React.FC<{ onSearch: (query: string) => void}> = ({ onSearch }) => {
	return (
		<div className="containered q-mx-auto flex flex-col gap-2 justify-center pb-8">
			<SearchBar onSearch={onSearch}/>

			<div className="flex md:flex-row flex-col-reverse justify-between gap-y-8">
				<CategoriesBar />
				<LocationSelect />
			</div>
		</div>
	);
};
