import { getAllImages } from '@/services/adminService';
import { useQuery } from '@tanstack/react-query';

export const adminKeys = {
  all: ['admin'] as const,
  images: () => [...adminKeys.all, 'images'] as const,
};

export function useAdminImagesQuery() {
  return useQuery({
    queryKey: adminKeys.images(),
    queryFn: getAllImages,
  });
}
