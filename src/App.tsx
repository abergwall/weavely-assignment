import { useEffect, useState } from "react";
import { ChildComponent } from "./components/ChildComponent";

export type ChildObject = {
  dataAttributes: { figmaNodeName: string };
  children?: ChildObject[];
  id: string;
};

function App() {
  const [data, setData] = useState<ChildObject[]>([]);
  const [filtered, setFilteredData] = useState<ChildObject[]>([]);

  const fetchData = async () => {
    const data = await fetch("data.json").then((res) => {
      return res.json();
    });
    setData(data?.frames);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filter = (array: ChildObject[], search: string) => {
    const filt: ChildObject[] = array?.filter(({ children }) =>
      children?.some((item) => {
        if (
          item.dataAttributes.figmaNodeName
            ?.toLocaleLowerCase()
            .startsWith(search.toLowerCase())
        ) {
          Object.assign(item, {
            ...item,
            children: [],
          });
          return true;
        }
        if (children) {
          return filter(children, search);
        }
        return false;
      })
    );
    setFilteredData(filt);
  };

  return (
    <>
      <input
        type="text"
        onChange={(event) => filter(data, event.currentTarget.value)}
      ></input>
      <div className="flex flex-col items-start">
        <div className="flex flex-col items-start">
          {data.map(({ children, dataAttributes, id }) => (
            <ChildComponent
              key={id}
              dataAttributes={dataAttributes}
              children={children}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
