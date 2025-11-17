export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  ProductDetail: {
    id: string;
    name: string;
    price: string;
    rating: number;
  };
};