import SelectDropdown from './components/SelectDropdown';
import jsonData from './data/data.json';

function App() {
  return (
    <main className="flex flex-col justify-center items-center my-5 w-[80%] mx-auto gap-5">
      <h1 className="mb-5 text-2xl font-bold">Searchable Dropdown</h1>
      <SelectDropdown
        labelText="Skills"
        id="skills-select"
        searchable
        options={jsonData.tech_stacks}
        placeholder="Select more than 1"
        multiple
      />
      <SelectDropdown
        labelText="University"
        id="university-select"
        searchable
        options={jsonData.universities}
      />
      <SelectDropdown
        labelText="Years of Experience"
        id="years-exp-select"
        options={Array.from({ length: 10 }, (_, i) => i + 1)}
        outlined={false}
      />
      <SelectDropdown
        labelText="Gender"
        id="gender-select"
        options={jsonData.gender}
        disablePortal
      />
    </main>
  );
}

export default App;
