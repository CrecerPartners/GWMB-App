export type MembershipStatus = 'guest' | 'pending' | 'verified' | 'rejected' | 'expired';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city_club: string | null;
  created_at: string;
  updated_at: string;
};

export type Membership = {
  user_id: string;
  status: MembershipStatus;
  application_reference: string | null;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MembershipApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export type MembershipApplication = {
  id: string;
  user_id: string;
  external_reference: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  occupation: string | null;
  motivation: string | null;
  status: MembershipApplicationStatus;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type VerificationRequestStatus = 'pending' | 'approved' | 'rejected';

export type MembershipVerificationRequest = {
  user_id: string;
  membership_email: string;
  phone: string;
  member_identifier: string | null;
  status: VerificationRequestStatus;
  review_note: string | null;
  submitted_at: string;
  updated_at: string;
};
