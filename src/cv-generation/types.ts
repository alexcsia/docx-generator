export interface Education {
  institution: string;
  degree?: string;
  major?: string;
  start_date: string;
  end_date: string;
  location: string;
  thesis: string;
  specialization: string;
  details?: string[];
}

export interface Experience {
  employer: string;
  location?: string;
  project: string;
  job_title: string;
  job_description: string[];
  start_date: string;
  end_date: string | null;
  contractType?: string;
}

export interface Skills {
  Fachkenntnisse: string[];
  Sprachkenntnisse: string[];
  other_skills: String[];
}

export interface Certifications {
  name: string;
  details: string;
  issuer?: string;
  issued_date?: string;
  expiry_date?: string;
}

export interface Training {
  name: string;
  details?: string;
  start_date?: string;
  end_date?: string;
}

export interface CVData {
  firstName: string;
  lastName: string;
  highest_degree: string;
  specialization: string;
  email: string;
  phone: string;
  education: Education[];
  certifications: Certifications[];
  experience: Experience[];
  skills: Skills;
  birthday: Date;
  nationality: string;
  image?: string;
  training: Training[];
}
