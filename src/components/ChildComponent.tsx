import { useState } from "react";
import { ChildObject } from "../App";

type ChildComponentProps = {
  dataAttributes: { figmaNodeName: string };
  children?: ChildObject[];
};

export const ChildComponent = ({
  dataAttributes,
  children,
}: ChildComponentProps) => {
  const [toggleLayer, setToggleLayer] = useState<boolean>(true);
  return (
    <div className="flex flex-col items-start ml-10">
      <button onClick={() => setToggleLayer(!toggleLayer)}>
        {dataAttributes.figmaNodeName}
      </button>
      {toggleLayer &&
        children?.map(({ dataAttributes, children, id }, index) => (
          <ChildComponent
            key={`${id}-${index}`}
            dataAttributes={dataAttributes}
            children={children}
          />
        ))}
    </div>
  );
};
