import {useCallback, useState} from 'react';

export const useMockBridges = () => {
  const [mockBridges, setMockBridges] = useState([
    {id: '1', name: 'Bridge1'},
    {id: '2', name: 'Bridge2'},
    {id: '3', name: 'Bridge3'},
    {id: '4', name: 'Bridge4'},
    {id: '5', name: 'Bridge5'},
  ]);

  const getMockBridgeById = useCallback(
    id => mockBridges.find(bridge => bridge.id === id),
    [mockBridges],
  );

  return {mockBridges, getMockBridgeById};
};
