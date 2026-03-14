import { CreateFoundPetDto } from '../dto/create-found-pet.dto';
import { buildLostAndFoundMapImage } from '../utils/mapbox-static-map';

interface LostPetMatchEmailData {
  id: number;
  name: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  description: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  address: string;
  lost_lat: number;
  lost_lng: number;
  distance: number;
}

export const buildFoundPetMatchTemplate = (
  match: LostPetMatchEmailData,
  foundPet: CreateFoundPetDto,
): string => {
  const finderName = foundPet.finderName ?? foundPet.finder_name ?? 'N/A';
  const finderEmail = foundPet.finderEmail ?? foundPet.finder_email ?? 'N/A';
  const finderPhone = foundPet.finderPhone ?? foundPet.finder_phone ?? 'N/A';
  const mapUrl = buildLostAndFoundMapImage(
    match.lost_lng,
    match.lost_lat,
    foundPet.lng,
    foundPet.lat,
  );

  return `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#222;">
      <h2 style="margin-bottom:8px;">Possible pet match found</h2>
      <p style="margin-top:0;">A found pet was reported within 500 meters of your lost pet record.</p>

      <h3>Found pet details</h3>
      <ul>
        <li><strong>Species:</strong> ${foundPet.species}</li>
        <li><strong>Breed:</strong> ${foundPet.breed ?? 'N/A'}</li>
        <li><strong>Color:</strong> ${foundPet.color}</li>
        <li><strong>Size:</strong> ${foundPet.size}</li>
        <li><strong>Description:</strong> ${foundPet.description}</li>
        <li><strong>Address:</strong> ${foundPet.address}</li>
      </ul>

      <h3>Finder contact</h3>
      <ul>
        <li><strong>Name:</strong> ${finderName}</li>
        <li><strong>Email:</strong> ${finderEmail}</li>
        <li><strong>Phone:</strong> ${finderPhone}</li>
      </ul>

      <h3>Your lost pet record</h3>
      <ul>
        <li><strong>Name:</strong> ${match.name}</li>
        <li><strong>Species:</strong> ${match.species}</li>
        <li><strong>Distance:</strong> ${match.distance.toFixed(2)} meters</li>
      </ul>

      <img src="${mapUrl}" alt="Map with lost and found locations" style="width:100%;border-radius:8px;border:1px solid #ddd;" />
      <p style="font-size:12px;color:#666;">Red marker: lost location. Blue marker: found location.</p>
    </div>
  `;
};
