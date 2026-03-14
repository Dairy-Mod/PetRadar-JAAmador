export class CreateLostPetDto {
  name!: string;
  species!: string;
  breed!: string;
  color!: string;
  size!: string;
  description!: string;
  photo_url?: string | null;
  photoUrl?: string | null;
  owner_name?: string;
  ownerName!: string;
  owner_email?: string;
  ownerEmail!: string;
  owner_phone?: string;
  ownerPhone!: string;
  lat!: number;
  lng!: number;
  address!: string;
  lost_date?: string;
  lostDate!: string;
  is_active?: boolean;
  isActive?: boolean;
}
