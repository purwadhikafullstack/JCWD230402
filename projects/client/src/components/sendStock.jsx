import React from 'react';
import {
    Tbody,
    Td,
} from '@chakra-ui/react'

function SendStock(props) {
    return (
        <Tbody >
            <Td>{props.idx + 1}</Td>
            <Td>{props.to}</Td>
            <Td>{props.product}</Td>
            <Td>{props.color}</Td>
            <Td>{props.memory}</Td>
            <Td>{props.request}</Td>
            <Td>{props.status}</Td>
        </Tbody>
    );
}

export default SendStock;