export class CreateFoundPetDto {
  species!: string;
  breed?: string | null;
  color!: string;
  size!: string;
  description!: string;
  photo_url?: string | null;
  photoUrl?: string | null;
  finder_name?: string;
  finderName!: string;
  finder_email?: string;
  finderEmail!: string;
  finder_phone?: string;
  finderPhone!: string;
  lat!: number;
  lng!: number;
  address!: string;
  found_date?: string;
  foundDate!: string;
}
