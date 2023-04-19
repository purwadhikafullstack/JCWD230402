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
      <InputGroup>
        <Input
          type="search"
          variant="filled"
          placeholder="Search..."
          bgColor="whiteAlpha.300"
          onChange={(e) => props.setprops(e.target.value)}
          color="white"
        />
        <InputRightAddon
          pointerEvents="visible"
          as="button"
          onClick={() => {
            props.onSearchBtn();
          }}
          border="none"
          bgColor="#1BFD9C"
          color="black"
          _active={{ bg: "black", color: "white" }}
        >
          <Icon as={FiSearch} />
        </InputRightAddon>
      </InputGroup>
    </Stack>
  );
};

export default SearchBar;
