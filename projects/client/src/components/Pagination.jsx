import React from "react";
import ReactPaginate from "react-paginate";

import { Flex } from "@chakra-ui/react";

const Pagination = (props) => {
  const pageCount = Math.ceil(props.totalData / props.size);


  return (
    <Flex>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        previousLabel="<<"
        marginPagesDisplayed={1} // number of pages at the start and end of pagination
        pageCount={pageCount} // number of pages to display
        pageRangeDisplayed={3} // number of pages between breaklabel
        onPageChange={props.paginate} // function to call when number button is clicked
        initialPage={props.page}
        // =======================================================================smua yang dibawah ini styling aja
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-num"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-num"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-num "}
        activeLinkClassName={"active"}
      />
    </Flex>
  );
};
export default Pagination;
