import styled from 'styled-components/native';

export const TextInput = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px 7px;
  border-radius: 4px;
  color: white;
  border: 0.5px solid ${(props) => (props.hasError ? 'tomato' : '')};
  margin-bottom: ${(props) => (props.lastOne ? '15' : 8)}px;
`;
