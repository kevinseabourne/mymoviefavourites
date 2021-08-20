import styled from "styled-components";

function Error({ statusCode }) {
  return (
    <Message>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </Message>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

const Message = styled.p``;
