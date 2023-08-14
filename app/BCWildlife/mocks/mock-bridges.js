import {useCallback, useState} from 'react';

export const useMockBridges = () => {
  const [mockBridges, setMockBridges] = useState([
    {
      bridgeId: 0,
      timestamp: 1691583698076,
      bridgeName: 'Mock Bridge',
      bridgeMotId: 'MockMOT',
      regionId: 1,
      roadName: 'Manor Rd.',
      bridgeType: 5,
      spanMaterial: 1,
      abutment: 1,
      underdeck: 1,
      beams: 3,
      columns: 1,
      crossingType: 2,
      habitat: 1,
      height: 2,
      length: 3.6,
      bridgeFor: [2],
      habitatComment: '',
      longitude: 1,
      latitude: 2,
    },
    // {id: '1', name: 'Bridge1'},
    // {id: '2', name: 'Bridge2'},
    // {id: '3', name: 'Bridge3'},
    // {id: '4', name: 'Bridge4'},
    // {id: '5', name: 'Bridge5'},
  ]);

  const getMockBridgeById = useCallback(
    id => mockBridges.find(bridge => bridge.id === id),
    [mockBridges],
  );

  return {mockBridges, getMockBridgeById};
};
