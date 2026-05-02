import { mockInventario } from '../data/mockInventario';

export const inventarioApi = {
  getInventario: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInventario);
      }, 800);
    });
  }
};
