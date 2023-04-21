import React from "react";
import { BsTrash } from "react-icons/bs";
import { Text, Flex, Box, Button, Icon, Image } from "@chakra-ui/react";

function CardCart(props) {
  return (
    <Box>
      {/* card body */}
      <Flex
        w={"full"}
        // bgColor={"red.700"}
        boxShadow={"dark-lg"}
        rounded={"xl"}
        // flexDir={"column"}
        // justifyContent={"space-between"}
      >
        {/*===================================================================== Left section ===========================================================================*/}
        <Flex
          flexDir={"column"}
          p={2}
          // bgColor={"blue.600"}
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
          wrap={"wrap"}
          p={2}
          pb={3}
          // bgColor={"green.700"}
          w={{ base: "65%", md: "35%" }}
          roundedRight={{ base: "xl", md: "none" }}
        >
          <Text
            as="h1"
            color={"#1BFD9C"}
            textAlign={"center"}
            fontSize={"xl"}
            mt="1"
            letterSpacing={"wider"}
            fontWeight={"hairline"}
          >
            {props.brand} - {props.product}
          </Text>
          <Text
            as="p"
            w={"full"}
            color={"#01a35e"}
            textAlign={{ base: "left", md: "center" }}
            my="2"
            fontSize={"xs"}
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
            {props.memory}
          </Text>
          <Text
            as="p"
            w={"full"}
            color={"#1BFD9C"}
            textAlign={{ base: "left", md: "center" }}
            fontSize={"lg"}
          >
            Rp. 20000000
          </Text>

          <Flex
            mt="4"
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
          >
            <Flex alignItems={"center"} my="auto">
              <button class="bg-bgglass rounded-l border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
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
                class="bg-bgglass rounded-r border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200"
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

        {/*===================================================================== MIddle section ===========================================================================*/}

        {/*===================================================================== Right section ===========================================================================*/}
        <Box
          display={{ base: "none", md: "flex" }}
          p={{ base: 1, md: 4 }}
          flexDir={"column"}
          alignItems={"center"}
          bgColor={"yellow.500"}
          w={"22.5%"}
        >
          <Text
            display={{ base: "none", md: "block" }}
            as={"p"}
            textAlign={"center"}
            color={"#1BFD9C"}
            mt={"1"}
          >
            Total Per Item
          </Text>
          <Box display={{ base: "inline-flex" }} alignItems={"center"} mt={2}>
            <button class="bg-bgglass rounded-l border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
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
            <div class="bg-bgglass border-t border-b border-gray-100 text-[#1BFD9C] hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">
              {props.totalQty}
            </div>
            <button class="bg-bg-glass rounded-r border text-[#1BFD9C] hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
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

          <button class="md:py-2 md:px-4 bg-emerald-400 text-white hover:text-black rounded-xl hover:bg-emerald-300 hover:scale-105 duration-500 active:bg-emerald-500 disabled:opacity-50 mt-4 w-full flex items-center justify-center gap-4">
            Remove
            <BsTrash />
          </button>
        </Box>
        {/*===================================================================== Right section ===========================================================================*/}
        <Box
          display={{ base: "none", md: "flex" }}
          p={{ base: 1, md: 4 }}
          flexDir={{ base: "column" }}
          alignItems={"center"}
          bgColor={"red.500"}
          w={"22.5%"}
          roundedRight={"xl"}
        >
          <Text as={"p"} textAlign={"center"} color={"#1BFD9C"} mt={1}>
            $1299
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default CardCart;
