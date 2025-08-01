import { useState, useCallback } from "react";
import type { ImageItem } from "../components/ImageEditSection";

export const useMenuSort = () => {
  const [limitedAsc, setLimitedAsc] = useState<boolean>(true);
  const [normalAsc, setNormalAsc] = useState<boolean>(true);
  const [sideAsc, setSideAsc] = useState<boolean>(true);

  const createSortHandler = useCallback(
    (
      items: ImageItem[],
      setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>,
      isAsc: boolean,
      setIsAsc: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      return () => {
        setItems(
          isAsc
            ? [...items].sort((a, b) => b.id - a.id)
            : [...items].sort((a, b) => a.id - b.id)
        );
        setIsAsc(!isAsc);
      };
    },
    []
  );

  return {
    limitedAsc,
    normalAsc,
    sideAsc,
    setLimitedAsc,
    setNormalAsc,
    setSideAsc,
    createSortHandler,
  };
};
