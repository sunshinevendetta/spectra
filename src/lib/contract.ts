const address = process.env.NEXT_PUBLIC_SPECTRAFORM_ADDRESS;

if (!address) {
  throw new Error('NEXT_PUBLIC_SPECTRAFORM_ADDRESS is missing in .env');
}

export const SPECTRAFORM_ADDRESS = address as `0x${string}`;