export const PROFILE_FIELD_MAP: Record<string, string> = {
  bio: 'bio',
  headline: 'headLine',
  headLine: 'headLine',
  birthday: 'birthday',
  country: 'country',
  city: 'city',
  avatar: 'avatar',
  memoji: 'memoji',
  banner: 'banner',
  logo: 'logo',
  openToWork: 'openToWork',
  open_to_work: 'openToWork',
  marriage: 'marriage',

  phone: 'contact.phone',
  email: 'contact.email',
  address: 'contact.address',
  website: 'contact.website',
};

export const setNestedValue = (obj: Record<string, any>, path: string, value: any) => {
  const keys = path.split('.');
  let current: Record<string, any> = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] ||= {};
      current = current[key];
    }
  }
};
