import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
} from '@chakra-ui/react'

function RequestStock(props) {

  return (
    <Tbody>
      <Td>{props.idx + 1}</Td>
      <Td>{props.from}</Td>
      <Td>{props.product}</Td>
      <Td>{props.color}</Td>
      <Td>{props.memory}</Td>
      <Td>{props.request}</Td>
      <Td>{props.status}</Td>
      <Td>
        <Button
          onClick={props.accept}
          _hover={"none"}
          bgColor={"blue.500"}
          style={{ color: "#E9F8F9" }}
        >
          Accept
        </Button>
        <Button
          onClick={props.reject}
          ml={2}
          _hover={"none"}
          bgColor={"red.500"}
          style={{ color: "#E9F8F9" }}
        >
          Reject
        </Button>
      </Td>
    </Tbody>
  );
}

export default RequestStock;