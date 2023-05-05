import React, { useEffect } from "react";
import {
  Stack,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

const SearchBar = (props) => {
  return (
    <Stack spacing={4}>
      <InputGroup size={{ md: "sm", lg: "md"}}>
        <Input
          type="search"
          variant="filled"
          placeholder="Search..."
          bgColor="inherit"
          onChange={(e) => props.setprops(e.target.value)}
          color="white"
          focusBorderColor="green.500"
        />
        <InputRightAddon
          pointerEvents="visible"
          as="button"
          onClick={() => {
            props.onSearchBtn();
          }}
          border="none"
          bgColor="inherit"
          _active={{ bg: "black", color: "white" }}
        >
          <Icon as={FiSearch} />
        </InputRightAddon>
      </InputGroup>
    </Stack>
  );
};

export default SearchBar;
