import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const wp = (percentage) => (width * percentage) / 100;
  const hp = (percentage) => (height * percentage) / 100;

  return { wp, hp };
};
