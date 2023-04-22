import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { Text, Flex, Box, Button, Icon, Image } from "@chakra-ui/react";

function CardCart(props) {
  const [plus, setPlus] = useState(true);

  const checkplus = () => {
    if (props.totalQty + 1 > props.available) {
      setPlus(true);
    } else {
      setPlus(false);
    }
  };

  useEffect(() => {
    checkplus();
  }, [props.totalQty]);
  return (
    <Box>
      {/* card body */}
      <Flex w={"full"} boxShadow={"dark-lg"} rounded={"xl"}>
        {/*===================================================================== Left section ===========================================================================*/}
        <Flex
          flexDir={"column"}
          p={2}
          w={{ base: "35%", md: "20%" }}
          roundedLeft={"xl"}
        >
          <Flex
            h={"full"}
            w={"full"}
            flexDir={{ base: "column" }}
            bgSize={"contain"}
          >
            <Image
              h={"full"}
              w={"full"}
              rounded={"xl"}
              alt="product picture"
              src={props.image}
            />
          </Flex>
        </Flex>
        {/*===================================================================== Left section ===========================================================================*/}

        {/*===================================================================== MIddle section ===========================================================================*/}

        <Flex
          color={"whiteAlpha.900"}
          wrap={"wrap"}
          p={2}
          pb={{ base: 3 }}
          w={{ base: "65%", md: "35%" }}
          roundedRight={{ base: "xl", md: "none" }}
          alignItems={"center"}
        >
          <Text
            as="h1"
            textAlign={{ base: "left", md: "center" }}
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            letterSpacing={"wider"}
            fontWeight={"hairline"}
          >
            {props.product}
          </Text>
          <Text
            as="p"
            w={"full"}
            textAlign={{ base: "left", md: "center" }}
            my={{ base: "2", md: "2.5", lg: "-2" }}
            letterSpacing={"wider"}
            fontSize={{ base: "xs", md: "sm", lg: "lg" }}
            display="flex"
            alignItems="center"
          >
            <span
              style={{
                borderRight: "1px solid #01a35e",
                paddingRight: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {props.color}
            </span>
            {props.memory} GB
          </Text>

          {props.discount === 0 ? (
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
              py="1"
              textAlign={{ base: "left", md: "center" }}
            >
              <Text
                as="p"
                w={"full"}
                textAlign={{ base: "left" }}
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                letterSpacing={"wider"}
              >
                {props.formattedprice}
              </Text>
            </Flex>
          ) : (
            <Flex alignItems={"center"} gap={2} py="1" wrap={"wrap"}>
              <Flex
                mt={"3px"}
                backgroundColor={"rgba(52,211,153,0.1)"}
                rounded={"md"}
                px={"5px"}
              >
                <Text
                  color={"#34D399"}
                  textAlign={"center"}
                  fontWeight={"bold"}
                  fontSize={{ base: "xs", lg: "sm" }}
                  letterSpacing={"normal"}
                >
                  {props.discount * 100}%
                </Text>
              </Flex>

              <Text
                textAlign={{ base: "left", md: "center" }}
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                letterSpacing={"wider"}
              >
                {props.formatteddiscount}
              </Text>
              <Text
                mt={"1px"}
                as={"s"}
                opacity={0.3}
                textAlign={{ base: "left", md: "center" }}
                fontSize={{ base: "xs", md: "sm" }}
              >
                {props.formattedprice}
              </Text>
            </Flex>
          )}

          {/*========================================================== UNDER MD breakpoint===========================================================================*/}

          <Flex
            mt="4"
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
            display={{ base: "flex", md: "none" }}
          >
            <Flex alignItems={"center"} my="auto">
              <button
                class="bg-bgglass rounded-l border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
                onClick={() => {
                  props.minusItem(props.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <div class="border-t border-b border-gray-100 text-[#1BFD9C] inline-flex items-center px-4 py-1 select-none">
                {props.totalQty}
              </div>
              <button
                class="bg-bgglass rounded-r border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-700 disabled:hover:bg-bgglass inline-flex items-center px-2 py-1 border-r border-gray-200"
                disabled={plus}
                onClick={() => {
                  props.addItem(props.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </Flex>

            <Icon
              color={"gray.400"}
              as={BsTrash}
              boxSize={{ base: 8 }}
              onClick={() => {
                props.removeItem(props.id);
              }}
              cursor={"pointer"}
            ></Icon>
          </Flex>
        </Flex>
        {/*========================================================== UNDER MD breakpoint===========================================================================*/}

        {/*===================================================================== MD and above ===========================================================================*/}
        <Box
          display={{ base: "none", md: "flex" }}
          p={{ base: 1, md: 4 }}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"22.5%"}
        >
          <Box display={"inline-flex"} alignItems={"center"} mt={2}>
            <button
              onClick={() => {
                props.minusItem(props.id);
              }}
              class="bg-bgglass rounded-l border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-4 py-2  border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <div class="border-t border-b border-gray-100 text-[#1BFD9C] inline-flex items-center px-5 py-2 select-none">
              {props.totalQty}
            </div>
            <button
              disabled={plus}
              onClick={() => {
                props.addItem(props.id);
              }}
              class="bg-bgglass rounded-r border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-700 disabled:hover:bg-bgglass inline-flex items-center px-4 py-2  border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </Box>

          <p
            onClick={() => {
              props.removeItem(props.id);
            }}
            as="button"
            class="text-lg underline underline-offset-4 text-white hover:text-red-600 duration-300 mt-4 flex items-center justify-center cursor-pointer"
          >
            Remove
          </p>
        </Box>
        {/*===================================================================== Right section ===========================================================================*/}
        <Box
          display={{ base: "none", md: "flex" }}
          p={4}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"22.5%"}
          roundedRight={"xl"}
        >
          <Text
            as={"p"}
            textAlign={"center"}
            color={"#1BFD9C"}
            letterSpacing={"wider"}
            fontSize={{ md: "lg", lg: "2xl" }}
            fontWeight={"semibold"}
          >
            {props.totalperitem}
          </Text>
        </Box>
      </Flex>
      {/*===================================================================== MD and above ===========================================================================*/}
    </Box>
  );
}

export default CardCart;
