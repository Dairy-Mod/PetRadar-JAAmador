import { envs } from 'src/config/envs';

export const buildLostAndFoundMapImage = (
  lostLng: number,
  lostLat: number,
  foundLng: number,
  foundLat: number,
): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const styleId = 'mapbox/streets-v12';
  const markers = `pin-s-l+e74c3c(${lostLng},${lostLat}),pin-s-l+3498db(${foundLng},${foundLat})`;
  return `https://api.mapbox.com/styles/v1/${styleId}/static/${markers}/auto/800x420?padding=80&access_token=${accessToken}`;
};
