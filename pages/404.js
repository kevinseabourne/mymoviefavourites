import styled from "styled-components";
import Link from "next/link";

export default function Custom404() {
  return (
    <Container>
      <Message>Page not Found</Message>
      <Link href="/">
        <ButtonContainer>
          <ButtonTitle>Return Home</ButtonTitle>
        </ButtonContainer>
      </Link>
    </Container>
  );
}

const Container = styled.main`
  margin-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Message = styled.h1`
  margin-bottom: 5px;
`;

const ButtonTitle = styled.span`
  color: #c3c5c7;
  letter-spacing: 0.1px;
  font-size: 1.02rem;
  font-weight: 600;
  white-space: nowrap;
`;

const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  padding: 15px 15px;
  margin-top: 8px;
  opacity: 0.8;
  transition: all 0.2s;
  box-sizing: border-box;
  border: 3px solid #2d72d9;
  background-color: rgba(18, 18, 18, 0.7);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    opacity: 1;
    cursor: pointer;
    &${ButtonTitle} {
      color: white;
    }
  }
`;
