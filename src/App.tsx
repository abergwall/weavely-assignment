import { useEffect, useState } from "react";

type ChildObject = {
  dataAttributes: { figmaNodeName: string };
  children?: ChildObject[];
};

function App() {
  const [data, setData] = useState<{ frames: ChildObject[] }>();
  const [toggleLayerOne, setToggleLayerOne] = useState<boolean>(true);
  const [toggleLayerTwo, setToggleLayerTwo] = useState<boolean>(true);
  const [toggleLayerThree, setToggleLayerThree] = useState<boolean>(true);

  const fetchData = async () => {
    const data = await fetch("data.json").then((res) => {
      return res.json();
    });
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filter = (search: string) =>
    data?.frames.filter(({ children }) => {
      const filtered = children?.some(({ dataAttributes, children }) => {
        console.log(dataAttributes.figmaNodeName);
        return dataAttributes?.figmaNodeName.includes(search)
          ? true
          : children?.some(({ dataAttributes }) => {
              console.log(dataAttributes.figmaNodeName);
              dataAttributes.figmaNodeName.toLowerCase().includes(search);
            });
      });
      return filtered;
    });

  return (
    <>
      <input
        type="text"
        onChange={(event) => filter(event.currentTarget.value)}
      ></input>
      <div className="flex flex-col items-start">
        {data?.frames.map(({ children, dataAttributes }) => (
          <div key={dataAttributes.figmaNodeName}>
            <button onClick={() => setToggleLayerOne(!toggleLayerOne)}>
              {dataAttributes.figmaNodeName}
            </button>
            {toggleLayerOne &&
              children?.map(({ children, dataAttributes }, index) => (
                <div
                  key={`${dataAttributes.figmaNodeName}-${index}`}
                  className="flex flex-col items-start ml-5"
                >
                  <button onClick={() => setToggleLayerTwo(!toggleLayerTwo)}>
                    {dataAttributes.figmaNodeName}
                  </button>
                  {toggleLayerTwo &&
                    children?.map(({ children, dataAttributes }, index) => (
                      <div
                        key={`${dataAttributes.figmaNodeName}-${index}`}
                        className="flex flex-col items-start ml-10"
                      >
                        <button
                          onClick={() => setToggleLayerThree(!toggleLayerThree)}
                        >
                          {dataAttributes.figmaNodeName}
                        </button>
                        {toggleLayerThree &&
                          children?.map(({ dataAttributes }, index) => (
                            <div
                              key={`${dataAttributes.figmaNodeName}-${index}`}
                              className="flex flex-col items-start ml-10"
                            >
                              {dataAttributes.figmaNodeName}
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
