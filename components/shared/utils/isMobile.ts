import { useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";

export const useIsLessThan = (widthThreshold) => {
    const windowSize = useWindowSize();
    const [isLess, setIsLess] = useState(false);
    useEffect(() => {
      if (windowSize.width < widthThreshold && !isLess) {
        setIsLess(true);
      } else if (windowSize.width >= widthThreshold && isLess) {
        setIsLess(false);
      }
    }, [isLess, widthThreshold, windowSize.width]);
    return isLess;
  };
