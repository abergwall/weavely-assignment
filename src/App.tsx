import { useEffect, useState } from "react";

type ChildObject = {
  dataAttributes: { figmaNodeName: string };
  children?: ChildObject[];
};

function App() {
  const [data, setData] = useState<ChildObject[]>();
  const [filtered, setFilteredData] = useState<string[]>();

  const fetchData = async () => {
    const data = await fetch("data.json").then((res) => {
      return res.json();
    });
    setData(data?.frames);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filter = (search: string) => {
    const filt = data
      ?.filter(({ children }) => {
        return children?.filter(({ children, dataAttributes }) => {
          dataAttributes.figmaNodeName?.toLocaleLowerCase().includes(search);

          return children?.filter(({ dataAttributes }) => {
            dataAttributes.figmaNodeName?.toLocaleLowerCase().includes(search);
          });
        });
      })
      .map(({ dataAttributes }) => [dataAttributes.figmaNodeName]);

    return filt;
  };

  return (
    <>
      <input
        type="text"
        onChange={(event) => filter(event.currentTarget.value)}
      ></input>
      <div className="flex flex-col items-start">
        {data && <TreeComponent data={data}></TreeComponent>}
      </div>
    </>
  );
}

type TreeComponentProps = {
  data: ChildObject[];
};

const TreeComponent = ({ data }: TreeComponentProps) => {
  const [toggleLayerOne, setToggleLayerOne] = useState<boolean>(true);
  const [toggleLayerTwo, setToggleLayerTwo] = useState<boolean>(true);
  const [toggleLayerThree, setToggleLayerThree] = useState<boolean>(true);

  return (
    <div className="flex flex-col items-start">
      {data?.map(({ children, dataAttributes }) => (
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
  );
};

export default App;
