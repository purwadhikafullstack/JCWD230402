import {
  Card,
  CardBody,
  Stack,
  Heading,
  Image,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

function ProductCard(props) {
  const forURL = props.name.replace(/\s+/g, "_");
  return (
    <Card
      w={{ base: "11.5rem", md: "14rem", xl: "25rem" }}
      direction="column"
      overflow="hidden"
      variant="outline"
      color={"white"}
      bgColor="transparent"
      border={"none"}
      transition="transform 0.25s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <NavLink to={`/product/${forURL}`}>
        <Image
          objectFit="contain"
          height={{ base: "200px", md: "270px", lg: "300px", xl: "350px" }}
          width="full"
          src={props.productimage}
          alt="Product image"
        />
      </NavLink>
      <Stack mt={2} spacing={"1"}>
        <CardBody textAlign={"center"} letterSpacing={"widest"}>
          <Heading
            fontWeight={"normal"}
            size="sm"
            mb={{ base: 2, md: 3, lg: 4 }}
          >
            {props.category}
          </Heading>
          <Heading fontWeight={"normal"} size="sm">
            {props.name}
          </Heading>

          <NavLink to={`/product/${forURL}`}>
            <Button
              backgroundColor={"transparent"}
              _hover={{ backgroundColor: "inherit" }}
              color={"green.500"}
              border={"1px"}
              px={3}
              pb={1}
              mt={5}
            >
              <Text
                color={"#1BFD9C"}
                size="sm"
                fontWeight={"medium"}
                letterSpacing={"wider"}
              >
                Buy Now
              </Text>
            </Button>
          </NavLink>
        </CardBody>
      </Stack>
    </Card>
  );
}

export default ProductCard;
