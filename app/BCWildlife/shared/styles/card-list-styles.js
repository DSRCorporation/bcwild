import {StyleSheet} from 'react-native';

const useCardListStyles = () => {
  return StyleSheet.create({
    cardList: {
      flex: 7,
      padding: 16,
    },
    card: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 16,
      marginBottom: 16,
    },
    cardName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    cardValue: {
      fontSize: 14,
      marginBottom: 16,
    },
    cardButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardButton: {
      flex: 1,
      height: 32,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    cardButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
};

export {useCardListStyles};
