import { Box } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE, PAGES } from "./constants";
import Header from "./Header.component";

const headerHeight = 10;

export type WithHeaderProps = {
  currentPage: keyof typeof PAGES;
};

export const WithHeader: React.FC = ({ children }) => {
  const [currentPage, setPage] = useState<keyof typeof PAGES>(DEFAULT_PAGE);

  const childrenWithProps = useMemo(
    () =>
      React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { setPage, currentPage });
        }
        return child;
      }),
    [children, currentPage]
  );

  const handleSetPage = useCallback((nextPage: keyof typeof PAGES) => {
    setPage(nextPage);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          height: headerHeight,
          width: 1,
          bgcolor: "gray.1",
        }}
      >
        <Header setPage={handleSetPage} />
      </Box>
      <Box
        sx={{
          display: "flex",
          marginTop: headerHeight,
          width: 1,
        }}
      >
        {childrenWithProps}
      </Box>
    </Box>
  );
};
