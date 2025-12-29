import styled from "styled-components";

const Container = styled.footer`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  width: 100%;
  background-color: #18181b;
  color: #acb3beff;
  padding: 0.8rem 0rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0rem 1rem 0rem 1rem;
  font-size: 0.9rem;
`;

const BottomRow = styled.div`
  text-align: center;
  font-size: 0.7rem;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.3;
`;

export default function BottomSection() {
  return (
    <Container>
      <TopRow>
        <Text>Created by pepi<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in December 2025</Text>
        <Text>© 2025 LoL Esports by Pepi. All rights reserved.</Text>
      </TopRow>
      <BottomRow>
        <Text>
          This page is for informational purposes only. It should not be used as a reference for betting or making financial decisions.
        </Text>
      </BottomRow>
    </Container>
  );
}