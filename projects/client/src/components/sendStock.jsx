import React from 'react';
import {
    Tbody,
    Td,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux';

function SendStock(props) {

    const roleId = useSelector((state) => state.adminReducer.roleId);

    return (
        <Tbody >
            <Td>{props.idx + 1}</Td>
            <Td>{props.from}</Td>
            {
                roleId == 1 ? <Td>{props.to}</Td> : null
            }
            <Td>{props.product}</Td>
            <Td>{props.color}</Td>
            <Td>{props.memory}</Td>
            <Td>{props.request}</Td>
            <Td>{props.status}</Td>
        </Tbody>
    );
}

export default SendStock;