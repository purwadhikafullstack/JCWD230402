import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../styles.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import { Image } from "@chakra-ui/react";

export default function SwiperCarousel(props) {
  function printImages() {
    return props.productPictures.map((val) => {
      return (
        <SwiperSlide>
          <Image
            w="full"
            minH={{ lg: "700px" }}
            maxH={"720px"}
            src={val.picture}
            alt="Product image"
            objectFit="contain"
            borderRadius={"lg"}
          />
        </SwiperSlide>
      );
    });
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {printImages()}
      </Swiper>
    </>
  );
}
